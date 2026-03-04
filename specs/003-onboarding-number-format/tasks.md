# Tasks: Plugin Onboarding & Number Format

**Input**: Design documents from `/specs/003-onboarding-number-format/`
**Prerequisites**: plan.md, spec.md, research.md, contracts/messages.md, quickstart.md

**Tests**: No test tasks — manual validation via Figma plugin import (per quickstart.md Scenarios 1–6).

**Organization**: US1 and US2 share the same `ui.html` and must run sequentially (US2 builds on the view-swap infrastructure from US1). US3 is partially parallel — the `code.js` zero-padding change (T015) is independent and can run alongside the `ui.html` US3 tasks.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed — plugin already exists. Proceeding directly to foundational tasks.

_(No tasks — existing codebase is the starting point)_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the two new message handlers to `code.js` that US1 depends on for onboarding state persistence. Must complete before US1 can be implemented.

**⚠️ CRITICAL**: US1 onboarding view cannot function without these handlers.

- [X] T001 Add `get-onboarding-state` message handler to the `switch` block in `code.js`: call `figma.clientStorage.getAsync('onboardingSeen')`, then `figma.ui.postMessage({ type: 'onboarding-state', hasSeen: !!value })`
- [X] T002 Add `set-onboarding-seen` message handler to the `switch` block in `code.js`: call `figma.clientStorage.setAsync('onboardingSeen', true)` (no reply message needed)

**Checkpoint**: Both handlers in code.js. The plugin can now persist and retrieve onboarding state across sessions.

---

## Phase 3: User Story 1 — First-Time User Onboarding (Priority: P1) 🎯 MVP

**Goal**: Show an onboarding screen on first plugin launch explaining what the plugin does, how to name the page number layer, and how slides are ordered. Dismiss → main UI. Second launch → main UI directly.

**Independent Test**: Clear `onboardingSeen` from clientStorage (or fresh install). Open plugin — verify onboarding screen. Dismiss — verify main UI. Close and reopen — verify main UI opens directly without onboarding.

### Implementation for User Story 1

- [X] T003 [US1] Add `#onboarding-view` HTML block as a sibling of `#main-view` in `ui.html` — full panel containing: (a) header with plugin icon and title, (b) "What it does" description paragraph, (c) `{p#}` layer naming example in a code-styled block, (d) reading order explanation with a 3×3 ASCII grid `[1][2][3] / [4][5][6] / [7][8][9]`, (e) "Got it" primary button
- [X] T004 [US1] Add CSS for `#onboarding-view` in the `<style>` block in `ui.html`: `display: none; flex-direction: column; height: 100%; padding: 16px; gap: 16px;` — matches the card/spacing aesthetic of `#main-view`. Add `.onboarding-example` code block style. **Both views start hidden**: set both `#onboarding-view { display: none; }` and `#main-view { display: none; }` as the initial CSS state — JS always calls `showView()` after the `onboarding-state` reply from code.js to reveal the correct view, eliminating any flash for returning users
- [X] T005 [US1] Add `showView(viewId)` JS helper function and `let hasSeen = false` state variable to the `<script>` block in `ui.html`: `showView` sets `display: flex` on the target div and `display: none` on the other; called with `'onboarding-view'` or `'main-view'`
- [X] T006 [US1] On `window` load event in `ui.html` `<script>`, send `{ type: 'get-onboarding-state' }` to code.js; in the `onmessage` handler, handle the `onboarding-state` reply: if `msg.hasSeen` is true, set `hasSeen = true` and call `showView('main-view')`; otherwise call `showView('onboarding-view')`
- [X] T007 [US1] Wire the "Got it" dismiss button click handler in `ui.html` `<script>`: if `!hasSeen`, send `{ type: 'set-onboarding-seen' }` and set `hasSeen = true`; always call `showView('main-view')`

**Checkpoint**: Plugin opens with onboarding on first launch. "Got it" transitions to main UI. Reopening shows main UI directly (clientStorage state persisted via code.js).

---

## Phase 4: User Story 2 — "How does this work?" Re-access (Priority: P2)

**Goal**: A persistent ? help trigger in the main UI header that re-opens the onboarding panel on demand. Dismissing returns to main UI with all form values preserved.

**Independent Test**: After dismissing onboarding, verify ? button is visible in the header. Click it — verify onboarding panel appears. Dismiss — verify main UI returns with form values intact.

### Implementation for User Story 2

- [X] T008 [US2] Add a ? help icon button (`<button id="help-btn">?</button>`) to the header of `#main-view` in `ui.html` — positioned top-right of the header row, alongside the existing plugin title
- [X] T009 [US2] Add CSS for `#help-btn` in `ui.html` `<style>` block: small circular button (`width: 20px; height: 20px; border-radius: 50%; font-size: 10px; font-weight: 700`), using `--figma-color-bg-tertiary` background with `--figma-color-text-secondary` text, hover state lifts with subtle `box-shadow`
- [X] T010 [US2] Wire `#help-btn` click handler in `ui.html` `<script>`: call `showView('onboarding-view')` — no message sent to code.js (seen state already `true`; the same "Got it" dismiss handler from T007 correctly returns to main view without re-sending `set-onboarding-seen` since `hasSeen` is already `true`)
- [X] T011 [US2] Disable `#help-btn` when a run is in progress in `ui.html` `<script>`: set `helpBtn.disabled = true` at the same point the Run button is disabled (before sending `run-numbering`); re-enable on `numbering-complete` receipt — prevents opening onboarding mid-run per spec edge case (spec.md L62)

**Checkpoint**: ? button visible in main UI header. Clicking opens onboarding. Dismissing returns to main UI. Help button is inactive during a run. Identifier field value, section selection, and all other form values are preserved (they live in `#main-view` DOM which is never destroyed, only hidden).

---

## Phase 5: User Story 3 — Number Format Selection (Priority: P3)

**Goal**: A segmented two-button toggle in the primary controls area (below identifier field, above advanced toggle) allowing the designer to choose plain (`1, 2, 3`) or zero-padded (`01, 02, 03`) numbering. Plain is the default on every launch. Zero-padding is applied in `numberSlides()`.

**Independent Test**: Configure zero-padded format. Run on a section with 15 slides. Verify slides 1–9 show `"01"`–`"09"` and slides 10–15 show `"10"`–`"15"`. Reopen plugin — verify format resets to plain.

### Implementation for User Story 3

- [X] T012 [US3] Add number format segmented control HTML to the primary controls area in `ui.html`, immediately after the identifier field block and before the `#advanced-toggle` button: a `<div class="format-toggle">` containing two `<button>` elements — `<button id="fmt-plain" class="fmt-btn active">1, 2, 3</button>` and `<button id="fmt-padded" class="fmt-btn">01, 02, 03</button>` — with a `<label>` above reading "Number Format"
- [X] T013 [US3] Add CSS for `.format-toggle` and `.fmt-btn` in `ui.html` `<style>` block: toggle container is `display: flex; gap: 0` with a border-radius group effect (left button has `border-radius: 4px 0 0 4px`, right has `0 4px 4px 0`). Each button uses standard control dimensions (`height: 28px; padding: 0 10px; font-size: 11px`). Active state: `background: var(--figma-color-bg-brand); color: var(--figma-color-text-onbrand); border-color: var(--figma-color-bg-brand)`. Inactive: default button style with `--figma-color-border`
- [X] T014 [US3] Add `let zeroPadded = false` state variable in `ui.html` `<script>`; wire click handlers for `#fmt-plain` and `#fmt-padded`: clicking a button sets `zeroPadded` accordingly and swaps the `active` CSS class between the two buttons
- [X] T015 [US3] Add `zeroPadded` field to the `getConfig()` function return object in `ui.html` `<script>`: `zeroPadded: zeroPadded` — this passes the format choice to `code.js` via the existing `run-numbering` message
- [X] T016 [P] [US3] Update the `pNode.characters` assignment in `numberSlides()` in `code.js` (currently `pNode.characters = String(pageNum)`) to: `pNode.characters = config.zeroPadded && pageNum < 10 ? '0' + pageNum : String(pageNum)` — the `[P]` marker applies because this is a different file from T012–T015 and can be written at any time after the foundational phase

**Checkpoint**: Number format toggle visible in primary area. Zero-padded produces `"01"`–`"09"` and `"10"`+. Plain produces `"1"`, `"2"`, etc. Format resets to plain on every plugin launch (`zeroPadded` initialized to `false`).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and final visual consistency pass

- [ ] T017 Run quickstart.md Scenarios 1–6: first-time onboarding, help trigger, zero-padded 15 slides, plain format, format resets on relaunch, help trigger inactive during run
- [X] T018 Final visual review: verify `#onboarding-view`, `#help-btn`, and `.format-toggle` use the same card/spacing/color-token aesthetic as the rest of `ui.html` — no hardcoded hex colors (use `var(--figma-color-*)` with fallbacks), consistent 11px labels, consistent 28px control heights in `ui.html`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — plugin already exists
- **Foundational (Phase 2)**: Can start immediately — adds handlers to `code.js`
- **User Story 1 (Phase 3)**: Depends on Foundational (T001, T002 must be done)
- **User Story 2 (Phase 4)**: Depends on US1 (uses `showView()` from T005 and dismiss logic from T007). Includes T011 (run-guard for help button)
- **User Story 3 (Phase 5)**: T012–T015 depend on US1 being complete (so the primary area layout is stable); T016 is independent (`code.js` change, marked [P])
- **Polish (Phase 6)**: After all user stories complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (T001, T002) — core infrastructure
- **US2 (P2)**: Depends on US1 — reuses `showView()` helper and dismiss button logic; T011 guards help button during runs
- **US3 (P3)**: T012–T015 depend on US1 layout being stable; T016 is parallel (different file)

### Within Each User Story

- HTML structure → CSS styles → JS logic → message wiring (sequential, same file)
- `code.js` changes (T016) can run alongside any `ui.html` tasks

### Parallel Opportunities

- T001 and T002 are in the same `switch` block — sequential but fast (2 small handlers)
- T016 (zero-padding in `code.js`) is marked [P] — can run in parallel with T012–T015
- T017 and T018 (polish) are independent of each other

---

## Parallel Example: US3

```text
# T012–T015 run sequentially in ui.html
Task T012: Add number format HTML in ui.html
Task T013: Add segmented control CSS in ui.html
Task T014: Add zeroPadded JS state and click handlers in ui.html
Task T015: Add zeroPadded to getConfig() in ui.html

# T016 runs in parallel (different file)
Task T016 [P]: Update pNode.characters in numberSlides() in code.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001–T002)
2. Complete Phase 3: User Story 1 (T003–T007)
3. **STOP and VALIDATE**: Import plugin, verify onboarding on first launch, dismiss → main UI, relaunch → main UI directly
4. Working MVP — new users can now understand the plugin and set up their `{p#}` layers

### Incremental Delivery

1. Foundational (T001–T002) → clientStorage infrastructure ready
2. US1 (T003–T007) → Onboarding on first launch → **MVP!**
3. US2 (T008–T011) → Help trigger for returning users (with run-guard)
4. US3 (T012–T016) → Number format choice
5. Polish (T017–T018) → Validation and visual consistency

---

## Notes

- All `ui.html` changes are sequential (single file)
- `code.js` has 3 changes: T001 (new handler), T002 (new handler), T016 (modified line in `numberSlides()`)
- No new files created — changes confined to the existing two-file plugin structure
- No build step — changes are immediately testable by reimporting the plugin manifest in Figma Desktop
- The `#main-view` and `#onboarding-view` are both always in the DOM — form values in `#main-view` are preserved when onboarding is shown and dismissed
