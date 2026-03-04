# Implementation Plan: Plugin UI Visual Enhancement

**Branch**: `002-ui-polish` | **Date**: 2026-03-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ui-polish/spec.md`

## Summary

Restructure and visually polish the existing Figma plugin UI. The primary change is promoting the page number identifier field from the collapsed "Advanced settings" panel to the always-visible primary area. Secondary changes improve spacing consistency, visual grouping, and results display. All changes are in `ui.html` only — no code.js or manifest.json modifications.

## Technical Context

**Language/Version**: JavaScript (ES2020+ — Figma plugin sandbox) + HTML/CSS (inline in ui.html)
**Primary Dependencies**: Figma Plugin API (built-in, no external packages)
**Storage**: N/A (no persistence)
**Testing**: Manual testing via Figma plugin import + visual verification in light and dark themes
**Target Platform**: Figma Desktop (plugin sandbox)
**Project Type**: Single project (modifying 1 file: ui.html)
**Performance Goals**: N/A (UI-only — no runtime performance impact)
**Constraints**: No build step, no external CSS, all styles inline in `<style>` tag
**Scale/Scope**: Single file modification, ~50–80 lines changed/moved

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is an uninitialized template — no project-specific principles defined. No gates to evaluate. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
figma-slide-numbering/
├── manifest.json        # Figma plugin manifest (UNCHANGED)
├── code.js              # Plugin main thread (UNCHANGED)
└── ui.html              # Plugin UI — ALL changes here
```

**Structure Decision**: No new files. All changes are CSS and HTML restructuring within the existing `ui.html`. The flat 3-file structure is preserved.

## Change Summary

### What Moves

| Element | From | To |
|---------|------|----|
| Identifier field + hint | Inside `#advanced-body` (collapsed) | Primary area, between section dropdown and Run button |
| Identifier validation | Part of advanced-section validation flow | Stays in `validate()` — no JS logic change needed |

### What Stays

| Element | Location | Notes |
|---------|----------|-------|
| Section dropdown | Primary area | Already correct placement |
| Width/height range | Advanced settings | Rarely changed per-run |
| Y tolerance | Advanced settings | Rarely changed per-run |
| Starting number | Advanced settings | Rarely changed per-run |
| Run button | Below primary controls | Already correct placement |
| Results area | Below Run button | Already correct placement |

### Visual Polish Targets

1. **Section spacing**: Add subtle dividers or increased gap between primary controls, advanced toggle, and results
2. **Label consistency**: Ensure all labels use the same weight/size/color
3. **Advanced toggle**: Clean chevron rotation, consistent hover state
4. **Results summary**: Tighten row spacing, ensure error count danger color works in both themes
5. **Slide log**: Verify scroll containment doesn't exceed plugin window height
6. **Empty/error states**: Consistent secondary text styling

### No-Change Boundaries

- `code.js`: Zero modifications — message protocol unchanged
- `manifest.json`: Zero modifications — plugin identity unchanged
- Default values: All field defaults (`{p#}`, 1900–1950, 1070–1090, 50, 1) unchanged
- Message types: `get-sections`, `run-numbering`, `sections-list`, `no-sections`, `numbering-complete` — all unchanged
- JavaScript logic in `<script>`: `validate()`, `getConfig()`, `safeInt()`, message handlers — logic unchanged, only DOM element position changes
