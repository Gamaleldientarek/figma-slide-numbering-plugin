# Implementation Plan: Plugin Onboarding & Number Format

**Branch**: `003-onboarding-number-format` | **Date**: 2026-03-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-onboarding-number-format/spec.md`

## Summary

Add a first-time onboarding screen to the plugin that explains how it works (page number layer naming, reading order), a persistent help trigger that re-opens onboarding from the main UI, and a number format toggle (plain `1` vs zero-padded `01`) in the primary controls area. Onboarding seen-state is persisted via `figma.clientStorage`. All UI changes are in `ui.html`; storage and number formatting changes are in `code.js`.

## Technical Context

**Language/Version**: JavaScript (ES2020+ — Figma plugin sandbox) + HTML/CSS (inline in ui.html)
**Primary Dependencies**: Figma Plugin API (built-in) — specifically `figma.clientStorage` for persistence
**Storage**: `figma.clientStorage.getAsync` / `figma.clientStorage.setAsync` — per-plugin, per-device key-value store
**Testing**: Manual testing via Figma plugin import — onboarding state, view switching, number format output
**Target Platform**: Figma Desktop (plugin sandbox)
**Project Type**: Two-file modification (`ui.html` + `code.js`)
**Performance Goals**: N/A — no runtime performance impact
**Constraints**: No build step, no external packages, all storage via Figma's built-in clientStorage API
**Scale/Scope**: ~100–150 lines added to ui.html; ~25–35 lines added/changed in code.js

## Constitution Check

Constitution is an uninitialized template — no project-specific principles defined. No gates to evaluate. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/003-onboarding-number-format/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── messages.md      # Phase 1 output — updated message protocol
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
figma-slide-numbering/
├── manifest.json        # UNCHANGED
├── code.js              # CHANGED: clientStorage handlers + zero-padding in numberSlides()
└── ui.html              # CHANGED: onboarding view, help trigger, number format control
```

**Structure Decision**: No new source files. Changes are confined to the existing two active files. The flat 3-file plugin structure is preserved.

## Change Summary

### New in `ui.html`

| Element | Location | Notes |
|---------|----------|-------|
| `#onboarding-view` | New top-level div, sibling of `#main-view` | Full-panel view shown on first launch |
| Onboarding content | Inside `#onboarding-view` | Plugin description, `{p#}` example, reading order diagram |
| "Got it" dismiss button | Bottom of `#onboarding-view` | Sends `set-onboarding-seen`, switches to `#main-view` |
| Help trigger (? icon) | Plugin header area (top-right of header) | Visible at all times on main view; shows `#onboarding-view` |
| Number format control | Primary area (below identifier field) | Two-option segmented control: "1, 2, 3" / "01, 02, 03" |

### New in `code.js`

| Change | Location | Notes |
|--------|----------|-------|
| `get-onboarding-state` handler | Message switch | Reads `clientStorage` key `onboardingSeen`, replies with `onboarding-state` |
| `set-onboarding-seen` handler | Message switch | Writes `clientStorage.setAsync('onboardingSeen', true)` |
| Zero-padding in `numberSlides()` | Line ~114 (pNode.characters assignment) | `config.zeroPadded && pageNum < 10 ? '0' + pageNum : String(pageNum)` |
| `zeroPadded` in config | `run-numbering` message payload | Boolean passed from UI, default `false` |

### Message Protocol Changes

| Message (UI → plugin) | New/Changed | Description |
|-----------------------|-------------|-------------|
| `get-onboarding-state` | **New** | Request onboarding seen state on plugin load |
| `set-onboarding-seen` | **New** | Mark onboarding as seen, persist to clientStorage |
| `run-numbering` config | **Changed** | Adds `zeroPadded: boolean` field |

| Message (plugin → UI) | New/Changed | Description |
|-----------------------|-------------|-------------|
| `onboarding-state` | **New** | `{ hasSeen: boolean }` — UI uses this to decide which view to show |

### What Stays Unchanged

- All existing message types (`get-sections`, `sections-list`, `no-sections`, `numbering-complete`, `open-url`)
- `detectSlides()`, `sortSlides()`, `findPageNumNode()` — untouched
- All existing form controls and their default values
- `manifest.json` — untouched
- Plugin window dimensions (320×560)

## View Architecture

The plugin has two mutually exclusive views:

```
Plugin window (320×560)
├── #onboarding-view   ← shown on first launch (display: flex)
│   ├── Header
│   ├── Onboarding content (description, example, reading order)
│   └── "Got it" button
└── #main-view         ← shown after onboarding dismissed (display: flex)
    ├── Header (with ? help trigger)
    ├── Primary controls (section, identifier, number format)
    ├── Advanced toggle + body
    ├── Run button
    └── Results area
```

**View switching**: CSS `display: none / flex` toggled by JS. No routing, no animation. The `#onboarding-view` overlaps nothing — both views are in the DOM at all times but only one is visible.

**Startup sequence**:
1. Plugin loads → UI sends `get-onboarding-state` immediately
2. `code.js` reads `clientStorage.getAsync('onboardingSeen')` → replies `onboarding-state { hasSeen }`
3. If `hasSeen === false` (or undefined) → show `#onboarding-view`
4. If `hasSeen === true` → show `#main-view`

**Help trigger**: Clicking the ? button in the main view header shows `#onboarding-view` without sending any messages — no storage write. Dismissing from here returns to `#main-view` (also no storage write — already seen).

## Number Format Control

Placed in the **primary area** (below identifier, above advanced toggle) per FR-010.

```
[ Section dropdown           ▼ ]
[ Page Number Identifier: {p#}  ]
[ Number Format: [1, 2, 3] [01, 02, 03] ]  ← segmented control
[ ▶ Advanced settings           ]
[ Number Slides             ]
```

**Segmented control**: Two adjacent buttons styled as a toggle group. Active option has `background: var(--figma-color-bg-brand); color: var(--figma-color-text-onbrand)`. Inactive is default button style.

**Default**: plain (`1, 2, 3`) on every plugin launch — not persisted (FR-009 / SC-005).

**Zero-padding algorithm** (applied in `numberSlides()`):
```javascript
pNode.characters = config.zeroPadded && pageNum < 10
  ? '0' + pageNum
  : String(pageNum);
```
- `1` → `"01"`, `9` → `"09"`, `10` → `"10"`, `100` → `"100"` ✓

## Complexity Tracking

No constitution violations. No complexity justification required.
