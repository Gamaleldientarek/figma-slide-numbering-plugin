# Tasks: Plugin UI Visual Enhancement

**Input**: Design documents from `/specs/002-ui-polish/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: No test tasks — manual visual testing via Figma plugin import (per plan.md).

**Organization**: Tasks grouped by user story. All changes are in a single file (`figma-slide-numbering/ui.html`) so parallelism is limited — tasks are sequential within each phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: No setup needed — plugin already exists and works. Proceeding directly to user stories.

_(No tasks — existing codebase is the starting point)_

---

## Phase 2: Foundational

**Purpose**: No foundational changes needed — all modifications are CSS/HTML restructuring within the existing ui.html file.

_(No tasks — code.js message protocol and manifest.json are unchanged)_

---

## Phase 3: User Story 1 — Clear Visual Hierarchy for Primary Controls (Priority: P1) 🎯 MVP

**Goal**: Promote the identifier field from collapsed advanced settings to the always-visible primary area

**Independent Test**: Open the plugin in Figma. Without clicking anything, verify both section dropdown and identifier field are visible. Verify advanced settings are collapsed but accessible with width/height/tolerance/starting-number inside.

### Implementation for User Story 1

- [X] T001 [US1] Move the identifier field HTML block (label, input, hint) from inside `#advanced-body` to the primary area between the section dropdown and the advanced toggle in figma-slide-numbering/ui.html
- [X] T002 [US1] Verify identifier validation still works in `validate()` after the DOM move — the JS references `getElementById('identifier')` which is position-independent, so no JS changes expected, but confirm in figma-slide-numbering/ui.html
- [X] T003 [US1] Verify `getConfig()` still reads the identifier value correctly after the move in figma-slide-numbering/ui.html

**Checkpoint**: Plugin opens with section dropdown and identifier field both visible. Advanced settings collapsed. Numbering still works with the moved identifier field.

---

## Phase 4: User Story 2 — Polished Visual Design (Priority: P2)

**Goal**: Consistent spacing, visual grouping, and native Figma aesthetic

**Independent Test**: Open the plugin side-by-side with Figma's Design panel. Verify control heights, font sizes, spacing, and color usage feel consistent.

### Implementation for User Story 2

- [X] T004 [US2] Add visual section separators between primary controls, advanced toggle, and results area using spacing or subtle dividers in figma-slide-numbering/ui.html
- [X] T005 [US2] Audit and normalize all label styles to use consistent weight (500), size (11px), and color (--figma-color-text-secondary) in figma-slide-numbering/ui.html
- [X] T006 [US2] Audit all hardcoded hex color values in CSS — replace with Figma theme variable equivalents (keep hex only as fallbacks in `var()`) in figma-slide-numbering/ui.html
- [X] T007 [US2] Polish the advanced toggle: ensure chevron indicator (▶/▼) renders cleanly, add transition or smooth visual feedback on hover in figma-slide-numbering/ui.html
- [X] T008 [US2] Verify all form controls (select, text input, number input) use consistent height (28px), padding (0 8px), border-radius (4px), and font-size (11px) in figma-slide-numbering/ui.html

**Checkpoint**: Plugin looks visually cohesive. All controls match Figma's native panel aesthetics. Colors adapt correctly in both light and dark themes.

---

## Phase 5: User Story 3 — Readable, Scannable Results Display (Priority: P3)

**Goal**: Results summary scannable at a glance, per-slide log scroll-contained

**Independent Test**: Run the plugin on a section with 20+ slides including covers and errors. Verify summary is immediately visible, slide log is scrollable, error count is visually distinct.

### Implementation for User Story 3

- [X] T009 [US3] Review and tighten results summary spacing: ensure result rows have consistent vertical rhythm and labels are clearly aligned with values in figma-slide-numbering/ui.html
- [X] T010 [US3] Verify error count uses danger color correctly via `--figma-color-text-danger` in both light and dark themes in figma-slide-numbering/ui.html
- [X] T011 [US3] Verify slide log scroll containment: ensure `#slide-log` max-height (150px) keeps the plugin within its 500px window height even with 96+ slide results in figma-slide-numbering/ui.html
- [X] T012 [US3] Polish empty state and no-slides-found messages: verify consistent secondary text color, centered alignment, and adequate padding in figma-slide-numbering/ui.html

**Checkpoint**: Results are scannable at a glance. Slide log scrolls within its container. Error count is visually distinct. Empty states are styled consistently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final visual consistency pass and validation

- [ ] T013 Run quickstart.md validation: test all 5 verification scenarios (identifier visibility, advanced settings, dark/light themes, scroll containment, visual consistency)
- [X] T014 Final review: scan entire ui.html for any remaining hardcoded colors, inconsistent spacing, or misaligned controls in figma-slide-numbering/ui.html

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — plugin already exists
- **Foundational (Phase 2)**: Skipped — no shared infrastructure changes
- **User Story 1 (Phase 3)**: Can start immediately — moves the identifier field
- **User Story 2 (Phase 4)**: Can start after US1 (visual polish builds on new layout)
- **User Story 3 (Phase 5)**: Can start after US1 (results polish is independent of US2)
- **Polish (Phase 6)**: After all user stories complete

### User Story Dependencies

- **US1 (P1)**: Independent — the core layout restructuring
- **US2 (P2)**: Depends on US1 (polish the new layout, not the old one)
- **US3 (P3)**: Depends on US1 (results area is below the restructured primary area)

### Parallel Opportunities

- US2 and US3 could theoretically run in parallel after US1, since they target different sections of ui.html (form controls vs. results area)
- Within each phase, tasks are sequential (same file, overlapping CSS concerns)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (T001–T003)
2. **STOP and VALIDATE**: Import plugin, verify identifier is in primary area
3. Working MVP — most impactful UX improvement delivered

### Incremental Delivery

1. US1 → Identifier promoted to primary area → **MVP!**
2. US2 → Visual consistency and spacing → Polished look
3. US3 → Results display polish → Complete experience
4. Final pass → Quickstart validation → Ship

---

## Notes

- All changes in a single file: `figma-slide-numbering/ui.html`
- No code.js or manifest.json modifications
- No new files created
- No build step — changes are immediately testable by reimporting the plugin
- Manual testing only — import manifest.json into Figma Desktop
