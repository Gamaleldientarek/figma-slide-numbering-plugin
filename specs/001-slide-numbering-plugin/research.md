# Research: Figma Slide Numbering Plugin

## R1: Figma Plugin API for Text Manipulation

**Decision**: Use `figma.loadFontAsync(fontName)` before setting `textNode.characters`.

**Rationale**: Figma requires fonts to be loaded before modifying text content. This is mandatory — without it, the API throws an error. The font used by the existing text must be loaded (not an arbitrary font), to preserve the designer's chosen typography.

**Alternatives considered**:
- Setting font explicitly to a known font (e.g., Inter) — rejected because it would override the designer's font choice, violating FR-006.
- Using `textNode.deleteCharacters()` + `textNode.insertCharacters()` — unnecessary complexity; direct `.characters` assignment works after font load.

## R2: Mixed Font Handling

**Decision**: Detect `fontName === figma.mixed`, then iterate character ranges to collect all font variants, load each, then set `.characters`.

**Rationale**: Some text layers use different fonts for different character ranges (e.g., bold first character). The Figma API returns `figma.mixed` for the `fontName` property when multiple fonts are used. Each unique font must be loaded individually.

**Alternatives considered**:
- Skipping mixed-font layers and reporting as error — rejected because this is a valid use case that should be handled gracefully per FR-007.

## R3: Figma Plugin Manifest Configuration

**Decision**: Use `"documentAccess": "dynamic-page"` with `"editorType": ["figma"]`. No network access needed.

**Rationale**: `dynamic-page` allows the plugin to access nodes on the current page without loading the entire document. Since slides are always on the current page, this is sufficient and performs better than full document access. No network permissions needed since the plugin is fully offline (FR-013, Assumptions).

**Alternatives considered**:
- `"documentAccess": "all"` — rejected because it loads all pages unnecessarily, slower for large files.

## R4: Plugin UI Communication Pattern

**Decision**: Use `figma.ui.postMessage()` / `figma.ui.onmessage` for bidirectional communication between code.js and ui.html.

**Rationale**: This is the standard and only supported communication pattern for Figma plugins with UI. The UI (ui.html) runs in an iframe; the main thread (code.js) runs in the plugin sandbox. PostMessage is the bridge.

**Alternatives considered**:
- No UI (run on launch) — rejected because the user needs to configure parameters per FR-010 and review results per FR-008.

## R5: Section Node Discovery

**Decision**: Use `figma.currentPage.children.filter(c => c.type === 'SECTION')` to find all sections on the current page.

**Rationale**: Sections are always top-level children of a page in Figma. No deep traversal needed. This returns all sections for the dropdown (FR-001).

**Alternatives considered**:
- Using `figma.currentPage.findAll()` — unnecessary overhead; sections are always direct page children.

## R6: No Build Step Required

**Decision**: Write vanilla JavaScript (ES2020) directly. No bundler, no TypeScript, no build step.

**Rationale**: Figma's plugin sandbox supports modern JavaScript natively. The plugin is small (~300-400 lines across 2 files). Adding a build step would add complexity without benefit. This matches the existing FigCli plugin pattern.

**Alternatives considered**:
- TypeScript + esbuild — rejected for a 3-file plugin; overhead not justified.

## R7: Plugin UI Theming (from online research)

**Decision**: Use `figma.showUI(__html__, { themeColors: true })` and Figma's built-in CSS variables for native light/dark theme support.

**Rationale**: Figma injects CSS variables (e.g., `--figma-color-bg`, `--figma-color-text`, `--figma-color-bg-brand`) and adds `figma-light` or `figma-dark` class to the HTML element. This gives automatic theme switching with zero custom code. Native look: Inter font at 11px / 16px line-height, 6px border-radius on buttons, 4px on inputs.

**Alternatives considered**:
- Hardcoded dark theme CSS — rejected because it won't match Figma's light mode and requires manual color maintenance.

**Key CSS variables**:
- Backgrounds: `--figma-color-bg`, `--figma-color-bg-secondary`, `--figma-color-bg-brand`
- Text: `--figma-color-text`, `--figma-color-text-secondary`, `--figma-color-text-onbrand`
- Borders: `--figma-color-border`, `--figma-color-border-strong`
- States: `--figma-color-bg-brand-hover`, `--figma-color-bg-brand-pressed`, `--figma-color-bg-disabled`

**Source**: https://developers.figma.com/docs/plugins/css-variables/

## R8: Improved Mixed Font Handling (from online research)

**Decision**: Use `textNode.getRangeAllFontNames(0, textNode.characters.length)` + `Promise.all(fonts.map(figma.loadFontAsync))` instead of manual character-by-character iteration. Also check `textNode.hasMissingFont` before attempting any font operations.

**Rationale**: `getRangeAllFontNames()` is a built-in method that returns all unique fonts in one call — cleaner and more reliable than manual iteration. `hasMissingFont` allows graceful error reporting instead of a crash.

**Alternatives considered**:
- Manual character-range iteration — works but verbose; `getRangeAllFontNames()` is the idiomatic approach.

**Source**: https://developers.figma.com/docs/plugins/working-with-text/

## R9: Progress Feedback for Large Sections (from online research)

**Decision**: Use `figma.notify()` with `timeout: Infinity` and a cancel button for progress during long-running numbering operations (100+ slides).

**Rationale**: Figma's notify API supports persistent notifications with action buttons. For 200-slide sections, processing may take several seconds. A cancellable progress notification prevents the user from thinking the plugin froze. Messages are truncated at 100 characters — keep them concise.

**Pattern**:
```javascript
let cancelled = false;
const handle = figma.notify("Numbering slides...", {
  timeout: Infinity,
  button: { text: "Cancel", action: () => { cancelled = true; } }
});
// ... process, checking `cancelled` between slides ...
handle.cancel(); // Dismiss when done
```

**Source**: https://developers.figma.com/docs/plugins/api/properties/figma-notify/

## R10: Editor Type — Figma Slides Support (from online research)

**Decision**: Include `"slides"` in `editorType` alongside `"figma"` to support the Figma Slides editor (added in Plugin API Update 122, January 2026).

**Rationale**: Figma Slides is a presentation-focused editor where slide numbering is especially relevant. Supporting it extends the plugin's usefulness to the exact use case it was designed for.

**Source**: https://developers.figma.com/docs/plugins/updates/
