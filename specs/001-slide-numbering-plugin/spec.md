# Feature Specification: Figma Slide Numbering Plugin

**Feature Branch**: `001-slide-numbering-plugin`
**Created**: 2026-03-04
**Status**: Draft
**Input**: A Figma plugin that applies sequential page numbers to slides in large presentation files, with configurable detection and sorting controls.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Number All Slides in a Section (Priority: P1)

A designer has a large Figma presentation with 50–150 slides arranged in rows inside a Section. Each slide has a designated page number text layer. The designer launches the plugin, selects the target section, and clicks Run. The plugin detects all slides, sorts them by visual reading order (top-to-bottom, left-to-right), and assigns sequential page numbers to each slide's page number layer. Cover slides (without a page number layer) are counted in the sequence but display no number.

**Why this priority**: This is the core value proposition — automating what would otherwise be a tedious manual task of numbering 50–150 slides one by one.

**Independent Test**: Can be fully tested by opening a Figma file with a section containing multiple slides with page number text layers, running the plugin, and verifying the numbers are sequential and match visual order.

**Acceptance Scenarios**:

1. **Given** a section with 96 slides (14 covers + 82 numbered) arranged in 14 rows, **When** the user selects the section and clicks Run with default settings, **Then** all 82 page number layers display correct sequential numbers (covers counted but not labeled), ending at 96.
2. **Given** a section with slides at varying Y positions within ±50px tolerance, **When** the plugin sorts the slides, **Then** slides at similar Y positions are grouped into the same row and sorted left-to-right by X position.
3. **Given** a slide whose page number text layer uses a specific font, **When** the plugin updates the text, **Then** the font is preserved and the number displays correctly without rendering errors.

---

### User Story 2 - Configure Detection Parameters (Priority: P2)

A designer works on a presentation that uses non-standard slide dimensions or a different naming convention for the page number layer. The designer opens the plugin, adjusts the width/height range, page number identifier pattern, and row tolerance to match their file's structure, then runs the numbering.

**Why this priority**: Different Figma files use different slide sizes and naming conventions. Without configurable parameters, the plugin only works for one specific file structure.

**Independent Test**: Can be tested by creating a Figma file with slides of a custom size (e.g., 1280×720) and a custom page number layer name (e.g., `#page`), configuring the plugin to match, and verifying correct numbering.

**Acceptance Scenarios**:

1. **Given** slides with dimensions 1280×720, **When** the user sets width range to 1270–1290 and height range to 710–730, **Then** the plugin correctly detects and numbers those slides.
2. **Given** page number text layers named `#page` instead of `{p#}`, **When** the user changes the identifier to `#page`, **Then** the plugin finds and updates those text layers.
3. **Given** slides arranged with only 20px Y-variation within rows, **When** the user sets Y tolerance to 30px, **Then** the plugin correctly groups slides into rows.

---

### User Story 3 - Review Results Before Closing (Priority: P3)

After running the numbering, the designer wants to confirm how many slides were processed, how many were skipped (covers), and whether any errors occurred — all without leaving the plugin.

**Why this priority**: Feedback and transparency build confidence. If something went wrong (e.g., a slide was missed), the designer needs to know immediately rather than discovering it later during review.

**Independent Test**: Can be tested by running the plugin on a known section and verifying the results log shows correct counts for total slides, updated, skipped, and errors.

**Acceptance Scenarios**:

1. **Given** a completed numbering run on 96 slides (82 numbered, 14 covers), **When** the results are displayed, **Then** the log shows "96 total, 82 updated, 14 skipped, 0 errors."
2. **Given** a run where 2 slides have text layers with mixed or unloadable fonts, **When** the numbering completes, **Then** the results log lists those 2 slides as errors with a description of the issue.

---

### Edge Cases

- What happens when the selected section contains zero slides matching the size filter? The plugin displays a clear message: "No slides found matching the current size filter."
- What happens when a slide has multiple text layers matching the identifier pattern? The plugin uses the first match found (depth-first traversal).
- What happens when a page number text layer uses mixed fonts across its characters? The plugin loads all font variants before updating.
- What happens when two slides have identical X and Y positions? They are treated as the same position; their relative order is deterministic but unspecified.
- What happens when the section has only cover slides (none with page number layers)? The plugin reports "0 updated, N skipped" with no errors.
- What happens when the starting number is set to a value other than 1 (e.g., 5)? The first slide is numbered 5, and subsequent slides increment from there.

## Clarifications

### Session 2026-03-04

- Q: Should the plugin persist settings between sessions or reset to defaults? → A: Reset to defaults each time — settings vary per file, so the user should configure fresh each session.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Plugin MUST scan the current Figma page for all Section nodes and populate a dropdown for the user to select one.
- **FR-002**: Plugin MUST filter section children to only include slide-type nodes (FRAME, COMPONENT, INSTANCE, COMPONENT_SET) whose width and height fall within the user-configured ranges.
- **FR-003**: Plugin MUST sort detected slides by visual reading order — grouped into rows by Y position (within a configurable tolerance), then sorted left-to-right by X position within each row.
- **FR-004**: Plugin MUST recursively search each slide for a text node whose **name** contains the user-configured identifier pattern (default: `{p#}`).
- **FR-005**: Plugin MUST assign sequential page numbers starting from the user-configured starting number. Slides without a matching page number layer (covers) MUST be counted in the sequence but not labeled.
- **FR-006**: Plugin MUST preserve the existing font of each page number text layer when updating its content.
- **FR-007**: Plugin MUST handle text layers with mixed fonts by loading all font variants before updating.
- **FR-008**: Plugin MUST display a results summary after each run showing: total slides detected, number updated, number skipped (covers), and number of errors.
- **FR-009**: Plugin MUST display an error description for any slide whose page number could not be updated (e.g., font loading failure).
- **FR-010**: Plugin MUST provide configurable controls for: section selection, page number identifier, width range (min/max), height range (min/max), Y tolerance, and starting number.
- **FR-011**: Plugin MUST show a clear message when no sections are found on the current page.
- **FR-012**: Plugin MUST show a clear message when no slides match the current filter settings.
- **FR-013**: Plugin MUST reset all configuration controls to their default values each time the plugin is launched. Settings MUST NOT persist between sessions.

### Key Entities

- **Section**: A Figma SECTION node that acts as a container for slides. The user selects which section to process.
- **Slide**: A direct child of a section that matches the configured type and size criteria. Represents one page of the presentation.
- **Page Number Layer**: A text node within a slide, identified by its layer name matching the configured pattern. Holds the displayable page number.
- **Cover Slide**: A slide that has no page number layer. Participates in sequential counting but displays no number.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can number all slides in a 100-slide section in under 10 seconds of interaction (select section, click Run, review results).
- **SC-002**: 100% of slides with a page number layer receive the correct sequential number matching their visual position order.
- **SC-003**: The plugin correctly handles sections with up to 200 slides without failure or incorrect ordering.
- **SC-004**: Users can adapt the plugin to a new file structure (different slide sizes, different layer naming) in under 30 seconds by adjusting the configuration controls.
- **SC-005**: The results summary provides enough information for the user to verify correctness without manually inspecting each slide (total, updated, skipped, errors).

## Assumptions

- Slides are always arranged in a grid pattern (rows of similar Y position, columns of increasing X position). Freeform or diagonal layouts are not supported.
- The page number text layer naming convention is consistent within a given section (all use the same identifier pattern).
- Each slide has at most one page number text layer matching the identifier.
- The plugin operates on one section at a time. Cross-section numbering requires multiple runs.
- Cover slides are always identifiable by the absence of a page number layer (no separate "cover" flag or naming convention is needed).
- The plugin runs fully offline with no network access required.
