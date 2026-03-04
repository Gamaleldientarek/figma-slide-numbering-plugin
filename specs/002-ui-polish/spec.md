# Feature Specification: Plugin UI Visual Enhancement

**Feature Branch**: `002-ui-polish`
**Created**: 2026-03-04
**Status**: Draft
**Input**: Enhance the UI of the Figma slide numbering plugin to be more visually appealing

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Clear Visual Hierarchy for Primary Controls (Priority: P1)

A designer opens the plugin and immediately sees the most important controls — section picker and page number identifier — without needing to expand any collapsible section. The layout feels purposeful: what changes per-run is prominent, and what rarely changes is tucked away neatly. The designer can start a run without hunting through settings.

**Why this priority**: The identifier field currently lives inside "Advanced settings", but it changes frequently between Figma files. Moving it to the primary panel removes the single biggest friction point from the most common workflow.

**Independent Test**: Open the plugin in a fresh Figma file. Without clicking anything, verify the section dropdown and identifier field are both visible. Verify advanced settings are collapsed but accessible.

**Acceptance Scenarios**:

1. **Given** the plugin just opened, **When** the designer looks at the UI, **Then** the section dropdown and identifier field are both visible without expanding any section.
2. **Given** the identifier field is on the primary panel, **When** the designer changes it and clicks Run, **Then** the new identifier is used correctly (the primary field is functionally wired, not cosmetic).
3. **Given** the advanced settings are collapsed, **When** the designer clicks the toggle, **Then** width/height range, Y tolerance, and starting number are revealed in a clean expandable panel.

---

### User Story 2 — Polished Visual Design Matching Figma's Aesthetic (Priority: P2)

A designer who uses Figma every day expects third-party plugins to feel native — consistent type scale, spacing rhythm, border radius, and color usage that aligns with Figma's own panel design. The plugin currently uses correct Figma color tokens but lacks the visual refinement (spacing, grouping, subtle dividers, weight contrast) that makes a UI feel intentional.

**Why this priority**: A visually polished plugin builds trust and reduces cognitive friction. Designers are a highly visually-sensitive audience — a rough UI distracts from the workflow.

**Independent Test**: Open the plugin side-by-side with a native Figma panel (e.g., the Design panel). Verify font sizes, spacing, border radius, and control heights feel consistent with Figma's native UI language.

**Acceptance Scenarios**:

1. **Given** the plugin is open, **When** the designer scans the UI, **Then** all labels, inputs, and buttons use a consistent type scale with no mismatched sizes between controls.
2. **Given** sections of the UI (primary controls, advanced settings, results), **When** displayed together, **Then** each section is visually separated with appropriate spacing or dividers — not an undifferentiated block of controls.
3. **Given** Figma is in dark mode, **When** the plugin opens, **Then** all colors adapt correctly using Figma's theme color variables with no hardcoded colors appearing incorrectly.

---

### User Story 3 — Readable, Scannable Results Display (Priority: P3)

After running the plugin on 96 slides, the designer wants to quickly verify success without wading through a wall of text. The results area communicates the summary at a glance and lets the designer drill into per-slide details only if needed, with a scrollable log that does not push other UI out of view.

**Why this priority**: Results are shown after a run completes. When present, they must be immediately readable — a dense or cramped results area undermines the confidence the designer needs to trust the output.

**Independent Test**: Run the plugin on a section with 20+ slides including at least one cover and one error. Verify the summary (total/updated/skipped/errors) is immediately visible and scannable, and the per-slide log is scrollable without the UI growing beyond its window height.

**Acceptance Scenarios**:

1. **Given** a completed run with 96 total slides, **When** results are displayed, **Then** the summary counts are immediately visible and clearly labeled without scrolling.
2. **Given** a completed run with per-slide details, **When** the slide log is visible, **Then** it is contained in a scrollable area that does not cause the plugin window to overflow.
3. **Given** errors occurred during a run, **When** the error count is shown in the summary, **Then** it is visually distinct (different color or weight) from the non-error counts.

---

### Edge Cases

- What happens if the plugin window is too short to display the results log? The log must be scroll-contained — the window height must not grow beyond its configured size.
- What happens when there are 0 sections on the page? The empty state message must be styled consistently — not plain unstyled text.
- What happens when field hints make the advanced panel very tall? Hints must be compact and use secondary text styling without causing visual clutter.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The section dropdown and page number identifier field MUST both appear in the primary (always-visible) area of the plugin — no expanding required to access them.
- **FR-002**: Advanced settings (width range, height range, Y tolerance, starting number) MUST remain in a collapsible section, collapsed by default.
- **FR-003**: All form controls MUST use consistent height, padding, border radius, and font size that matches Figma's native panel control dimensions.
- **FR-004**: Related controls MUST be visually grouped with consistent spacing and clear section boundaries (labels, dividers, or whitespace).
- **FR-005**: All colors MUST be expressed using Figma theme color variables — no hardcoded hex values except as fallbacks for tokens not universally supported.
- **FR-006**: Field hints MUST be displayed below each input in a secondary text style (smaller, lower contrast) and MUST NOT use the error/danger color.
- **FR-007**: The results summary MUST present total, updated, skipped, and error counts in a visually scannable layout with clear labels.
- **FR-008**: The error count in the results summary MUST be visually differentiated (danger color) when errors are present.
- **FR-009**: The per-slide results log MUST be contained in a fixed-height scrollable area so it does not cause the plugin panel to overflow.
- **FR-010**: The Run button MUST have clear visual states for default, hover, active, and disabled — matching Figma's primary button visual language.
- **FR-011**: Empty state (no sections) and no-slides-found messages MUST use secondary text color and centered alignment, consistent with the rest of the UI.
- **FR-012**: The collapsible advanced settings toggle MUST have a clear open/closed indicator (chevron) and a hover state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A designer can locate and interact with the section picker and identifier field within 5 seconds of opening the plugin — without expanding any section.
- **SC-002**: All interactive controls (inputs, selects, buttons) use the same height and font size — zero visual inconsistencies in the control set.
- **SC-003**: The plugin window never grows beyond its configured height — results and logs are always scroll-contained regardless of result count.
- **SC-004**: All UI colors adapt correctly in both Figma light and dark themes with no hardcoded colors appearing incorrectly in either theme.
- **SC-005**: A designer reading the results summary can determine total/updated/skipped/errors at a glance in under 3 seconds.

## Assumptions

- The plugin window dimensions (width: 320px, height: ~500px) remain unchanged — this feature does not alter the window size configuration.
- Figma's CSS custom property color tokens (e.g., `--figma-color-text`, `--figma-color-bg-brand`) are available in the plugin's UI iframe and correctly reflect the active theme.
- The identifier field default value (`{p#}`) and all other default values remain unchanged — this feature only affects visual presentation and control placement, not defaults or behavior.
- No new controls are added — only the placement (primary vs. advanced) and visual treatment of existing controls changes.
