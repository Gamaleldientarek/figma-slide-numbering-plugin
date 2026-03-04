# Research: Plugin UI Visual Enhancement

**Branch**: `002-ui-polish` | **Date**: 2026-03-04

## Research Tasks

### R1: Figma Plugin UI Theming Best Practices

**Decision**: Use Figma's built-in CSS custom property color tokens exclusively (`--figma-color-*`). No hardcoded hex values except as fallbacks for tokens that may not exist in older Figma versions.

**Rationale**: Figma's plugin iframe injects these CSS variables at runtime, and they automatically adapt to the user's light/dark theme setting. This is the officially supported approach per Figma's plugin documentation.

**Alternatives considered**:
- Hardcoded dark-only theme: Rejected — breaks for users in light mode
- CSS media query `prefers-color-scheme`: Rejected — Figma's theme is independent of OS setting

### R2: Identifier Field Placement

**Decision**: Move the identifier field (`#identifier`) from inside `#advanced-body` to the primary (always-visible) area, positioned between the section dropdown and the Run button.

**Rationale**: The identifier changes per Figma file (different projects use different layer names for page numbers), making it a per-run configuration item — not a "rarely changed" advanced setting. The section dropdown and identifier are the two controls a designer interacts with most frequently.

**Alternatives considered**:
- Keep identifier in advanced but auto-expand on first launch: Rejected — adds complexity, still hides the most-used field
- Add a separate "Quick settings" section above advanced: Rejected — overcomplicates a 3-field primary area

### R3: CSS Layout Strategy for Plugin Window Containment

**Decision**: Use `overflow-y: auto` on the results/log areas with explicit `max-height` constraints. Do not use `overflow` on the `#app` container itself — let Figma's iframe handle outer scroll if needed.

**Rationale**: The plugin window is fixed at 500px height. The primary controls + advanced toggle + Run button occupy ~200px. Results + slide log must fit within the remaining ~300px. A `max-height: 150px` on the slide log ensures it never pushes the window beyond its configured size.

**Alternatives considered**:
- Make entire `#app` scrollable: Rejected — hides the Run button when results are long, bad UX
- Dynamic plugin window resizing via `figma.ui.resize()`: Rejected — causes jarring visual jumps, spec says keep window size unchanged

## No Further Research Needed

This feature modifies only HTML structure and CSS within an existing file. No new dependencies, no API changes, no data model changes. All decisions are resolved.
