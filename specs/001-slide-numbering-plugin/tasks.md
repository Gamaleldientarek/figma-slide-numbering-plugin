# Tasks: Figma Slide Numbering Plugin

**Input**: Design documents from `/specs/001-slide-numbering-plugin/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No test tasks — manual testing via Figma plugin import (per plan.md).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Create plugin skeleton and manifest

- [ ] T001 Create plugin manifest with Figma plugin configuration in figma-slide-numbering/manifest.json
- [ ] T002 [P] Create code.js skeleton with figma.showUI() and message handler stubs in figma-slide-numbering/code.js
- [ ] T003 [P] Create ui.html skeleton with dark theme, empty form, and postMessage bridge in figma-slide-numbering/ui.html

**Checkpoint**: Plugin can be imported into Figma and shows an empty UI window

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Section discovery and UI ↔ code.js communication — required before any user story

- [ ] T004 Implement `get-sections` handler in code.js: scan current page for SECTION nodes and return SectionInfo[] via postMessage in figma-slide-numbering/code.js
- [ ] T005 Implement section dropdown population in ui.html: receive `sections-list` message, populate dropdown, handle `no-sections` message with user feedback in figma-slide-numbering/ui.html

**Checkpoint**: Plugin launches, discovers sections on the current page, and populates the dropdown. "No sections" message shown when page has none.

---

## Phase 3: User Story 1 — Number All Slides in a Section (Priority: P1) 🎯 MVP

**Goal**: Core numbering engine — detect slides, sort by visual order, assign sequential page numbers

**Independent Test**: Import plugin into Figma, open a file with a Section containing slides with `{p#}` text layers, select the section, click Run with defaults, verify correct sequential numbers

### Implementation for User Story 1

- [ ] T006 [US1] Implement slide detection in code.js: filter section children by type (FRAME/COMPONENT/INSTANCE/COMPONENT_SET) and default size range (1900–1950 × 1070–1090) in figma-slide-numbering/code.js
- [ ] T007 [US1] Implement slide sorting in code.js: group by Y position (±50px tolerance), then sort left-to-right by X position within each row in figma-slide-numbering/code.js
- [ ] T008 [US1] Implement page number layer finder in code.js: recursive depth-first search for TEXT nodes whose name contains `{p#}` in figma-slide-numbering/code.js
- [ ] T009 [US1] Implement numbering engine in code.js: load fonts (handle mixed fonts), assign sequential numbers starting from 1, skip covers (count but don't label) in figma-slide-numbering/code.js
- [ ] T010 [US1] Wire `run-numbering` message handler in code.js: receive config from UI, execute detection → sort → number pipeline, return NumberingResult in figma-slide-numbering/code.js
- [ ] T011 [US1] Add Run button and basic results display in ui.html: send `run-numbering` message with default config, receive `numbering-complete`, show total/updated/skipped/errors in figma-slide-numbering/ui.html

**Checkpoint**: Plugin can number all slides in a section using default settings. Results show correct counts. This is the MVP.

---

## Phase 4: User Story 2 — Configure Detection Parameters (Priority: P2)

**Goal**: Add configurable controls so the plugin works with any slide size, identifier, and layout

**Independent Test**: Create a Figma file with non-standard slide sizes (e.g., 1280×720) and custom page number layer names (e.g., `#page`), configure the plugin to match, verify correct numbering

### Implementation for User Story 2

- [ ] T012 [US2] Add configuration form controls in ui.html: identifier input, width min/max, height min/max, Y tolerance, starting number — all with defaults per FR-010/FR-013 in figma-slide-numbering/ui.html
- [ ] T013 [US2] Update `run-numbering` message to include full PluginConfig from form values in figma-slide-numbering/ui.html
- [ ] T014 [US2] Update numbering engine in code.js to use PluginConfig values instead of hardcoded defaults (size range, identifier, tolerance, starting number) in figma-slide-numbering/code.js
- [ ] T015 [US2] Add input validation: minWidth ≤ maxWidth, minHeight ≤ maxHeight, startingNumber ≥ 0, identifier non-empty in figma-slide-numbering/ui.html

**Checkpoint**: Plugin works with custom slide sizes and identifier patterns. All controls reset to defaults on each launch.

---

## Phase 5: User Story 3 — Review Results Before Closing (Priority: P3)

**Goal**: Detailed results log so the designer can verify correctness without inspecting each slide

**Independent Test**: Run plugin on a known section, verify results log shows correct counts and any errors with slide names and descriptions

### Implementation for User Story 3

- [ ] T016 [US3] Enhance results display in ui.html: scrollable results log showing per-slide details (slide name, assigned number, status) in figma-slide-numbering/ui.html
- [ ] T017 [US3] Add error reporting in ui.html: list failed slides with slide name, attempted page number, and error description per FR-009 in figma-slide-numbering/ui.html
- [ ] T018 [US3] Update NumberingResult in code.js to include per-slide details (name + assigned number) for the results log in figma-slide-numbering/code.js

**Checkpoint**: Results log shows full breakdown. Errors (if any) show slide name and failure reason.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, empty states, and final quality

- [ ] T019 Handle edge case: zero slides matching filter — show "No slides found matching the current size filter" in figma-slide-numbering/code.js
- [ ] T020 Handle edge case: section with only covers — report "0 updated, N skipped" in figma-slide-numbering/code.js
- [ ] T021 [P] Add empty state message when current page has no sections per FR-011 in figma-slide-numbering/ui.html
- [ ] T022 [P] Style polish: consistent spacing, font sizes, dark theme alignment with Figma UI in figma-slide-numbering/ui.html
- [ ] T023 Run quickstart.md validation: import plugin, test with real Section 1 data (96 slides), verify numbers 1–96

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational
  - US1 (Phase 3): Can start after Phase 2 — no dependencies on other stories
  - US2 (Phase 4): Builds on US1 (extends the same code.js + ui.html with config)
  - US3 (Phase 5): Builds on US1 (extends results display)
- **Polish (Phase 6)**: After US1 minimum, ideally after all stories

### User Story Dependencies

- **US1 (P1)**: Independent — the core MVP
- **US2 (P2)**: Extends US1's code.js + ui.html — should implement after US1
- **US3 (P3)**: Extends US1's results — should implement after US1

### Parallel Opportunities

- T002 and T003 can run in parallel (different files)
- T006, T007, T008 are logically sequential within the same file but could be developed as separate functions
- T019, T020, T021, T022 can run in parallel (different concerns)
- US2 and US3 could run in parallel after US1 (different areas of ui.html)

---

## Parallel Example: Phase 1 Setup

```
# These can run in parallel (different files):
Task T002: Create code.js skeleton in figma-slide-numbering/code.js
Task T003: Create ui.html skeleton in figma-slide-numbering/ui.html
```

## Parallel Example: Phase 6 Polish

```
# These can run in parallel (different concerns):
Task T021: Empty state for no sections in ui.html
Task T022: Style polish in ui.html
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005)
3. Complete Phase 3: User Story 1 (T006–T011)
4. **STOP and VALIDATE**: Import plugin, test on real Section 1 data
5. Working MVP — numbers all slides with default settings

### Incremental Delivery

1. Setup + Foundational → Plugin shell ready
2. Add US1 → Core numbering works → **MVP!**
3. Add US2 → Configurable for any file structure
4. Add US3 → Detailed results log
5. Polish → Edge cases and styling

---

## Notes

- All 3 source files are in figma-slide-numbering/ (flat structure, no subdirectories)
- No build step — files served directly by Figma
- Manual testing only — import manifest.json into Figma Desktop
- Proven algorithm exists in CONTEXT.md — reuse for T006–T009
- Commit after each phase checkpoint
