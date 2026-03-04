# Research: Plugin Onboarding & Number Format

**Branch**: `003-onboarding-number-format` | **Date**: 2026-03-04

## Research Tasks

### R1: Figma Plugin Persistent Storage

**Decision**: Use `figma.clientStorage.getAsync(key)` / `figma.clientStorage.setAsync(key, value)` to persist the onboarding seen state.

**Rationale**: `figma.clientStorage` is Figma's official per-plugin, per-device key-value store. It persists across plugin sessions and survives the plugin iframe being closed and reopened. It is the only supported way to persist state between plugin sessions in a Figma plugin. The API is async and available in the plugin's main thread (`code.js`), not the UI iframe.

**Key**: `'onboardingSeen'` (boolean `true`). Missing key or `undefined` is treated as `false` (never seen).

**Alternatives considered**:
- `localStorage` in the UI iframe: Rejected — `localStorage` is not reliably available in Figma's sandboxed plugin iframe and is not the officially supported approach. Spec initially referenced this; corrected to Figma-native storage.
- No persistence (always show onboarding): Rejected — FR-003 requires it not appear on subsequent launches.
- Persist via Figma document nodes (using plugin data on a node): Rejected — ties state to a specific document rather than the user's device/installation.

### R2: View-Swap Pattern (No Routing)

**Decision**: Two sibling `<div>` views (`#onboarding-view` and `#main-view`) in the DOM at all times. Exactly one is visible (`display: flex`), the other is hidden (`display: none`). A JS function `showView(id)` handles the swap.

**Rationale**: The plugin has only two screens. A full routing system is unnecessary overhead. The view-swap pattern is the simplest possible implementation with zero dependencies. Both views being in the DOM avoids any re-initialization cost (form values in `#main-view` are preserved when switching to onboarding and back — satisfying FR-004 / US2 acceptance scenario 3).

**Alternatives considered**:
- Dynamically render onboarding HTML via JS: Rejected — increases complexity and makes HTML harder to read/maintain.
- CSS visibility toggling (visibility: hidden / visible): Rejected — hidden elements still occupy layout space, which would break the view-swap appearance.
- Single view with conditional CSS classes: Rejected — same complexity as the two-div approach but less readable.

### R3: Number Format Control — UI Pattern

**Decision**: Segmented two-button toggle (inline button pair) in the primary controls area. Left button = "1, 2, 3" (plain, default active). Right button = "01, 02, 03" (zero-padded). Active button uses `--figma-color-bg-brand` background.

**Rationale**: A segmented control clearly communicates "mutually exclusive options" — which is exactly what this is. It is compact (fits in one row), immediately readable (shows example output), and matches patterns used in Figma's own panels. A dropdown or radio buttons would take more vertical space for the same two options.

**Placement**: Below the identifier field, above the advanced toggle — primary area per FR-010. Not in advanced settings.

**Default**: Plain (`1, 2, 3`) on every plugin launch. The control is driven by a JS variable `zeroPadded = false` initialized on load — never read from storage (FR-009).

**Alternatives considered**:
- Checkbox "Zero-pad numbers (01, 02…)": Rejected — less visually clear about what the two states look like.
- Dropdown select: Rejected — overkill for two options; takes more clicks.
- Placing in Advanced settings: Rejected — FR-010 explicitly requires primary area placement.

### R4: Zero-Padding Algorithm

**Decision**: `pageNum < 10 ? '0' + pageNum : String(pageNum)` applied only when `config.zeroPadded === true`.

**Rationale**: Padding is always 2 digits (spec Assumption: "Zero-padding is always 2 digits"). Numbers 1–9 get a leading zero; 10+ do not. This handles the full range from starting numbers > 1 (e.g., starting at 5 → 05, 06, 07, 08, 09, 10, 11…) and 100+ slides (100 is not padded).

**Edge cases covered**:
- Starting number = 5, 15 slides: 05–09, 10–19 ✓
- Starting number = 1, 100 slides: 01–09, 10–100 (no over-padding of 3-digit numbers) ✓
- Plain format unchanged: `String(pageNum)` — identical to existing behavior ✓

**Alternatives considered**:
- `String(pageNum).padStart(2, '0')`: Would produce "100".padStart(2,'0') → "100" (correct), but also "10".padStart(2,'0') → "10" (correct). Actually equivalent — but the explicit `< 10` conditional is more readable and self-documenting.

### R5: Onboarding Content Scope

**Decision**: Static HTML content — no animations, no interactive steps (spec Assumption). Content covers: (1) what the plugin does in one sentence, (2) how to name the page number layer with a `{p#}` example, (3) reading order (left-to-right within rows, top-to-bottom across rows) with a simple 3×3 grid diagram using numbers.

**Rationale**: Keeps the onboarding panel within the 560px plugin height without scrolling. Static content is easier to maintain. A simple ASCII-style grid (e.g., [1][2][3] / [4][5][6]) communicates reading order without requiring images.

**Alternatives considered**:
- Multi-step wizard: Rejected — spec Assumptions explicitly state "no interactive tutorial steps or animations."
- Embedded image/screenshot: Rejected — images in Figma plugin UI require base64 encoding; adds maintenance overhead for minimal gain.

## No Further Research Needed

All decisions are resolved. The feature requires no new dependencies, no API integrations beyond Figma's built-in `clientStorage`, and no architectural changes beyond adding one new HTML view and two new message handlers.
