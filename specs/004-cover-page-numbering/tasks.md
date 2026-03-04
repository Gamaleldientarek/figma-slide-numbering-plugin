# Tasks: Cover Page Numbering Option

**Input**: Design documents from `/specs/004-cover-page-numbering/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are included because the project has an existing test suite (`npm test`).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No new project initialization needed — this feature extends existing files. Phase is empty.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core engine change that all user stories depend on

**⚠️ CRITICAL**: The numbering engine must support the `countCovers` config before UI or persistence work can begin.

- [x] T001 Modify `numberSlides()` in `code.js` to accept `countCovers` boolean in config — when `false`, do NOT increment `pageNum` for slides without a page-number layer (cover slides). Default to `true` for backward compatibility.
- [x] T002 Modify `numberSlides()` in `code.js` to pre-scan slides and count non-cover slides before numbering, so zero-padding width is calculated based on the actual highest number assigned (relevant when `countCovers` is `false`).
- [x] T003 Update `slideDetails` entries in `code.js` so that when `countCovers` is `false`, cover slides show `pageNumber: null` instead of the consumed sequence number.
- [x] T004 [P] ~~Add unit tests~~ SKIPPED — no test infrastructure (no package.json or tests/ directory).
- [x] T005 [P] ~~Add unit tests~~ SKIPPED — no test infrastructure.
- [x] T006 [P] ~~Add unit tests~~ SKIPPED — no test infrastructure.

**Checkpoint**: Numbering engine supports both counting modes. All existing tests still pass.

---

## Phase 3: User Story 1 - Exclude Cover Pages from Count (Priority: P1) 🎯 MVP

**Goal**: User can toggle cover counting ON/OFF in the UI and see correct numbering results.

**Independent Test**: Run the plugin on a section with interleaved cover and content slides. Toggle "Count covers" OFF, run numbering, verify content slides show consecutive numbers (1, 2, 3…) with no gaps.

### Implementation for User Story 1

- [x] T007 [US1] Add "Count covers" segmented toggle to primary controls card in `ui.html` — place below the number format toggle, using the same segmented button style. Labels: "Count all slides" / "Skip covers". Default selection: "Count all slides".
- [x] T008 [US1] Wire the toggle in `ui.html` to include `countCovers` boolean in the config object sent via `parent.postMessage({ pluginMessage: { type: 'run-numbering', config } })`.
- [x] T009 [US1] Update the `run-numbering` message handler in `code.js` to extract `countCovers` from the received config and pass it to `numberSlides()`. (Already handled — config object passes through directly.)
- [x] T010 [US1] ~~Add unit test~~ SKIPPED — no test infrastructure.
- [x] T011 [US1] ~~Add unit test~~ SKIPPED — no test infrastructure.

**Checkpoint**: User Story 1 is fully functional — toggle works, numbering respects the setting, edge cases handled.

---

## Phase 4: User Story 2 - Remember the Setting (Priority: P2)

**Goal**: The "Count covers" preference persists across plugin sessions via `figma.clientStorage`.

**Independent Test**: Set the toggle to "Skip covers", close and reopen the plugin, verify the toggle still shows "Skip covers".

### Implementation for User Story 2

- [x] T012 [US2] Add `figma.clientStorage.setAsync('countCovers', value)` call in `code.js` when the UI sends a toggle change message — follow the same pattern used for `zeroPadded` and `onboardingSeen`.
- [x] T013 [US2] Add `figma.clientStorage.getAsync('countCovers')` call in `code.js` on plugin init — send the persisted value (or default `true`) to the UI via `figma.ui.postMessage`.
- [x] T014 [US2] Update `ui.html` to listen for the persisted `countCovers` value on init and set the toggle state accordingly.
- [x] T015 [US2] ~~Add unit test~~ SKIPPED — no test infrastructure.

**Checkpoint**: Setting persists across sessions. First-launch defaults to ON (backward compatible).

---

## Phase 5: User Story 3 - Results Reflect the Setting (Priority: P3)

**Goal**: Results summary clearly communicates the counting mode used.

**Independent Test**: Run numbering with covers excluded, check that results show "N covers (not counted)" and slide details show correct numbers.

### Implementation for User Story 3

- [x] T016 [US3] Update results summary rendering in `ui.html` to show "N covers (not counted)" when `countCovers` is `false`, vs. "N covers" when `true`.
- [x] T017 [US3] Update slide details list in `ui.html` to show `"-"` for cover slide page numbers when `countCovers` is `false`. (Already handled — UI shows "—" for all cover slides.)
- [x] T018 [US3] Pass `countCovers` value from config to the results rendering logic in `ui.html` so the UI knows which mode was used. (Uses the `countCovers` JS variable directly.)

**Checkpoint**: Results clearly reflect whether covers were counted or excluded.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all modes and settings combinations.

- [x] T019 ~~Add integration test~~ SKIPPED — no test infrastructure.
- [x] T020 Manual code review completed — no test suite or linter configured.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately
- **User Story 1 (Phase 3)**: Depends on T001–T003 (engine changes)
- **User Story 2 (Phase 4)**: Depends on T007 (toggle exists in UI)
- **User Story 3 (Phase 5)**: Depends on T003 (slideDetails shows null for excluded covers) and T008 (config includes countCovers)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational phase — no dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 toggle existing in UI (T007)
- **User Story 3 (P3)**: Depends on Foundational (T003) and US1 config wiring (T008)

### Parallel Opportunities

- T004, T005, T006 can all run in parallel (separate test files)
- T007 and T009 touch different files (`ui.html` vs `code.js`) — can run in parallel
- T012 and T014 touch different files (`code.js` vs `ui.html`) — can run in parallel
- T016 and T017 both touch `ui.html` — must be sequential

---

## Parallel Example: Foundational Phase

```bash
# After T001-T003 (sequential engine changes in code.js):
# Launch all test tasks in parallel:
Task T004: "Test countCovers: false numbering"
Task T005: "Test countCovers: true numbering"
Task T006: "Test zero-padding with countCovers: false"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (engine changes + tests)
2. Complete Phase 3: User Story 1 (UI toggle + wiring)
3. **STOP and VALIDATE**: Test toggle ON/OFF with various slide decks
4. Deploy if ready — users get the core feature

### Incremental Delivery

1. Foundational → Engine supports both modes
2. Add User Story 1 → Toggle works → Deploy (MVP!)
3. Add User Story 2 → Setting persists → Deploy
4. Add User Story 3 → Results reflect mode → Deploy
5. Polish → Combined settings validated → Final release

---

## Notes

- All changes touch only 2 source files: `code.js` and `ui.html`
- The segmented toggle style must match the existing zero-padding toggle for visual consistency
- `figma.clientStorage` key: `countCovers` (boolean, default `true`)
- Cover slide detection logic is unchanged — only number assignment changes
