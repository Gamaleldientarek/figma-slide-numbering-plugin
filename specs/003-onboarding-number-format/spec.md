# Feature Specification: Plugin Onboarding & Number Format

**Feature Branch**: `003-onboarding-number-format`
**Created**: 2026-03-04
**Status**: Draft
**Input**: Onboarding UI showing how the plugin works and how to identify the page number layer, reading order note (left-to-right, top-to-bottom), and number format choice (01 vs 1)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First-Time User Onboarding (Priority: P1)

A designer installs the plugin for the first time and has no idea how it works or what the "page number identifier" means. When the plugin opens, they see a brief onboarding panel that explains: what the plugin does, what a page number layer is and how to name it, and how slides are sorted (left-to-right, top-to-bottom). After reading the explanation, they dismiss it and the main plugin UI is shown. The next time they open the plugin, the onboarding is not shown again.

**Why this priority**: Without onboarding, new users cannot use the plugin at all — they don't know they need a text layer named `{p#}` in their slides. This is the #1 support question a new user would have.

**Independent Test**: Install the plugin fresh (clear any stored onboarding state). Open it — verify the onboarding screen appears. Dismiss it — verify the main UI appears. Close and reopen the plugin — verify the main UI opens directly without onboarding.

**Acceptance Scenarios**:

1. **Given** the plugin is opened for the first time, **When** the UI loads, **Then** an onboarding screen is shown explaining what the plugin does, what the page number layer is, and how slides are ordered.
2. **Given** the onboarding screen is visible, **When** the designer clicks "Got it" or a dismiss button, **Then** the onboarding is hidden and the main plugin UI is shown.
3. **Given** the designer has previously dismissed onboarding, **When** they reopen the plugin in a new session, **Then** the main UI opens directly — no onboarding shown.
4. **Given** the onboarding screen is visible, **When** the designer reads the reading order explanation, **Then** it clearly states that slides are numbered left-to-right within each row, and rows are processed top-to-bottom.

---

### User Story 2 — "How does this work?" Re-access (Priority: P2)

A designer used the plugin weeks ago and forgot how to set up the page number layer. They want to re-read the onboarding instructions without having to reinstall the plugin. A small help icon or "How it works" link is visible on the main UI that re-opens the onboarding panel on demand.

**Why this priority**: Onboarding that can only be seen once is often missed or forgotten. Persistent access to help removes the need for external documentation.

**Independent Test**: After dismissing onboarding, verify a help/info trigger is visible on the main UI. Click it — verify the onboarding panel reappears. Dismiss it — verify the main UI returns.

**Acceptance Scenarios**:

1. **Given** the main plugin UI is showing, **When** the designer looks at the UI, **Then** a help or "How it works" trigger is visible and accessible.
2. **Given** the designer clicks the help trigger, **When** the onboarding panel opens, **Then** the same onboarding content is shown as during first-time use.
3. **Given** the onboarding is opened via help trigger, **When** dismissed, **Then** the designer returns to the main UI with all their form values preserved.

---

### User Story 3 — Number Format Selection (Priority: P3)

A designer wants their slide numbers to display with leading zeros (01, 02, 03 … 09, 10) instead of plain numbers (1, 2, 3 … 9, 10). This is common for presentations where slide numbers are part of a visual design system that requires consistent digit width. The designer can choose between plain numbers and zero-padded numbers from the plugin's controls.

**Why this priority**: This is a formatting preference that doesn't affect functionality. The core use case (numbering slides) works without it, making it a P3 enhancement.

**Independent Test**: Configure the plugin to use zero-padded format. Run on a section with at least 15 slides. Verify slides 1–9 are labeled "01"–"09" and slide 10+ are labeled without padding ("10", "11", etc.). Verify plain format still works as before.

**Acceptance Scenarios**:

1. **Given** the plugin is configured with zero-padded format and run on 15 slides, **When** results are applied, **Then** slides 1–9 show "01"–"09" and slides 10–15 show "10"–"15".
2. **Given** the plugin is configured with plain format (default), **When** run on 15 slides, **Then** slides show "1"–"15" with no leading zeros — identical to existing behavior.
3. **Given** the designer selects zero-padded format, **When** they run the plugin multiple times, **Then** the format choice resets to plain (default) on the next plugin launch, consistent with all other settings.

---

### Edge Cases

- What happens if the designer dismisses onboarding but then clears browser/app storage? Onboarding should reappear — the "seen" state is stored per-device; clearing storage resets it gracefully.
- What happens if the designer opens the help panel mid-run (while numbering is in progress)? The help panel should only be openable when the plugin is in idle state (Run button enabled); during a run, the trigger should be inactive or ignored.
- What happens with zero-padded format and starting numbers > 9? If starting number is 5 and slides go up to 100, numbers from 5–9 get padded ("05"–"09") and 10+ do not ("10"–"104"). The padding width is always 2 digits.
- What happens with zero-padded format and a 3-digit count (100+ slides)? Padding is 2-digit only — "100" is not padded to "100". This is consistent with typical presentation numbering conventions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The plugin MUST display an onboarding screen on first launch explaining: (a) what the plugin does, (b) what a page number layer is and how to name it using the identifier pattern, (c) how slides are ordered (left-to-right within rows, top-to-bottom across rows).
- **FR-002**: The onboarding screen MUST include a dismiss action that transitions the user to the main plugin UI.
- **FR-003**: Once dismissed, the onboarding MUST NOT appear automatically on subsequent plugin launches on the same device and installation.
- **FR-004**: The main plugin UI MUST include a persistent help trigger (icon or text link) that reopens the onboarding panel on demand at any time when the plugin is idle.
- **FR-005**: The onboarding content MUST include an explicit note that slides are sorted left-to-right within each row, and rows are processed top-to-bottom on the canvas.
- **FR-006**: The onboarding content MUST show a concrete example of a valid page number layer name (e.g., a text layer named `{p#}` inside a slide frame).
- **FR-007**: The plugin MUST provide a number format control with two options: plain numbers (1, 2, 3) and zero-padded numbers (01, 02, 03). Plain numbers MUST be the default.
- **FR-008**: When zero-padded format is selected, all page numbers from 1–9 MUST be written with a leading zero (01–09); numbers 10 and above MUST be written without padding.
- **FR-009**: The number format control MUST reset to the default (plain) on each plugin launch, consistent with all other plugin settings.
- **FR-010**: The number format selection MUST be accessible without expanding advanced settings — it is a primary per-run configuration choice.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can understand what the page number layer is and how to set one up within 60 seconds of opening the plugin, without consulting external documentation.
- **SC-002**: 100% of users who complete onboarding can successfully run the plugin on their first attempt (no "no slides found" error due to missing or incorrectly named page number layers).
- **SC-003**: The help trigger is reachable within 2 interactions from the main UI at any time.
- **SC-004**: Zero-padded numbering produces visually consistent 2-digit numbers for all slides 1–9 with zero errors across a 100-slide section.
- **SC-005**: The number format default (plain) is always in effect on plugin launch — no persistent state leaks between sessions.

## Assumptions

- The "seen onboarding" state is stored locally on the user's device within the plugin's storage context. If a user clears plugin data or uses a different device, onboarding will reappear — this is acceptable behavior.
- The number format control is placed in the primary (always-visible) area of the plugin, alongside the section dropdown and identifier field.
- Zero-padding is always 2 digits. There is no configurable padding width.
- The onboarding panel replaces the main UI view entirely when shown (full-panel overlay or view swap), rather than appearing as a tooltip or modal on top of the form.
- Onboarding contains only static content — no interactive tutorial steps or animations.
