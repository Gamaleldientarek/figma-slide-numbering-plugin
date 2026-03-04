# Feature Specification: Cover Page Numbering Option

**Feature Branch**: `004-cover-page-numbering`
**Created**: 2026-03-04
**Status**: Draft
**Input**: User description: "Adding an option to whether count the cover pages in numbering or not"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exclude Cover Pages from Count (Priority: P1)

A presenter has a slide deck with title slides and chapter-break slides that don't display page numbers. Currently, these "cover" slides (slides without a page-number layer) are counted in the numbering sequence, so the first content slide after a cover shows "2" instead of "1". The user wants cover slides to **not** consume a number, so content slides are numbered consecutively without gaps.

**Why this priority**: This is the core value of the feature — most users requesting this option want their visible numbers to be sequential without gaps caused by cover pages.

**Independent Test**: Can be fully tested by running the plugin on a section with interleaved cover and content slides, verifying that content slides show consecutive numbers (1, 2, 3…) with no gaps.

**Acceptance Scenarios**:

1. **Given** a section with 5 slides where slide 1 and slide 3 have no page-number layer (covers), **When** the user sets "Count covers" to OFF and runs numbering, **Then** slides 2, 4, and 5 display page numbers 1, 2, 3 respectively.
2. **Given** a section with 5 slides where slide 1 has no page-number layer, **When** the user sets "Count covers" to ON (current default behavior) and runs numbering, **Then** slides 2–5 display page numbers 2, 3, 4, 5 (cover consumes number 1).
3. **Given** a section with no cover slides (all slides have the page-number layer), **When** the user toggles "Count covers" to either ON or OFF, **Then** numbering is identical in both cases — all slides numbered sequentially.

---

### User Story 2 - Remember the Setting (Priority: P2)

A user frequently works with decks that have cover pages. They set "Count covers" to OFF once and expect the plugin to remember this choice the next time they open it, without having to toggle it every session.

**Why this priority**: Persistence avoids repetitive configuration and improves the experience for frequent users, but is secondary to the core counting logic.

**Independent Test**: Can be tested by setting the toggle, closing and re-opening the plugin, and verifying the toggle retains its last value.

**Acceptance Scenarios**:

1. **Given** the user sets "Count covers" to OFF and closes the plugin, **When** they reopen the plugin, **Then** the toggle still shows OFF.
2. **Given** the user has never used the plugin before (first launch), **When** the plugin opens, **Then** the "Count covers" toggle defaults to ON (preserving current behavior).

---

### User Story 3 - Results Reflect the Setting (Priority: P3)

After running the numbering with "Count covers" OFF, the results summary should clearly communicate how many slides were numbered and how many were skipped covers — making it obvious that covers were intentionally excluded from the count.

**Why this priority**: Transparency in results helps users verify the plugin did the right thing, but is a polish concern after the core logic works.

**Independent Test**: Can be tested by running numbering with covers excluded and checking that the results summary accurately reports updated vs. skipped counts and that slide details show the correct assigned numbers.

**Acceptance Scenarios**:

1. **Given** a section with 2 cover slides and 3 content slides, **When** the user runs numbering with "Count covers" OFF, **Then** results show "3 updated, 2 covers (not counted)" and slide details list content slides as 1, 2, 3.
2. **Given** the same section, **When** the user runs numbering with "Count covers" ON, **Then** results show "3 updated, 2 covers" and slide details list content slides as 2, 4, 5 (covers consumed numbers 1 and 3).

---

### Edge Cases

- What happens when **all slides are covers** (none have the page-number layer)? The plugin should report 0 updated, N covers, regardless of the toggle setting.
- What happens when the **starting number is not 1** (e.g., starting at 5) and "Count covers" is OFF? Numbering should still start at 5 but only assign numbers to non-cover slides consecutively (5, 6, 7…).
- What happens when **zero-padding is enabled** and "Count covers" is OFF? Padding should be calculated based on the highest number that will actually be assigned, not the total slide count.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The plugin MUST provide a toggle to control whether cover slides (slides without a page-number layer) consume a number in the sequence.
- **FR-002**: When "Count covers" is ON, the numbering sequence MUST include cover slides in the count (current behavior — a cover at position 2 means the next content slide gets number 3).
- **FR-003**: When "Count covers" is OFF, the numbering sequence MUST skip cover slides entirely — only slides with a page-number layer receive and consume sequential numbers.
- **FR-004**: The "Count covers" setting MUST default to ON for new users, preserving backward compatibility with existing behavior.
- **FR-005**: The plugin MUST persist the user's "Count covers" preference so it is restored on the next plugin launch.
- **FR-006**: The results summary MUST clearly indicate whether covers were counted or excluded in the current run.
- **FR-007**: The slide details in results MUST show the correct assigned page number for each slide, reflecting the chosen counting mode.
- **FR-008**: The "Count covers" toggle MUST work correctly in combination with all existing settings: starting number, zero-padding, width/height filters, and Y tolerance.

### Key Entities

- **Cover Slide**: A slide frame that does not contain a text layer matching the page-number identifier. It is detected (not explicitly marked by the user) based on the absence of the identifier layer.
- **Count Covers Setting**: A boolean preference (ON/OFF) controlling whether cover slides consume numbers in the sequence. Persisted per-device.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle the cover-counting option and see correct results in under 5 seconds of interaction time.
- **SC-002**: 100% of numbered content slides display consecutive numbers with no gaps when "Count covers" is OFF.
- **SC-003**: The setting persists across plugin sessions with 100% reliability — reopening the plugin always reflects the last saved preference.
- **SC-004**: Existing users who upgrade see no change in default behavior (covers are counted by default), ensuring zero disruption.
- **SC-005**: The results summary accurately reflects the counting mode used, enabling users to verify correctness at a glance.

## Assumptions

- "Cover slide" is defined solely by the absence of a text layer matching the page-number identifier — no new metadata or explicit tagging is needed.
- The toggle label uses clear, non-technical language understandable to presentation designers (e.g., "Count cover slides in numbering").
- The feature does not change how slides are detected or sorted — only how numbers are assigned to them.
- Zero-padding width calculation when "Count covers" is OFF should be based on the highest number that will actually be assigned (i.e., the count of non-cover slides plus starting number minus 1).
