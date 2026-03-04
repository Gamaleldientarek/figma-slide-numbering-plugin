# Quickstart: Plugin UI Visual Enhancement

**Branch**: `002-ui-polish` | **Date**: 2026-03-04

## Verification Steps

### Test 1: Identifier Field Visibility (FR-001)

1. Import the plugin into Figma Desktop via `manifest.json`
2. Open a Figma file with at least one Section containing slides
3. Launch the plugin
4. **Verify**: Section dropdown and identifier field are both visible immediately — no expanding required
5. **Verify**: The identifier field shows `{p#}` as default and has its hint text below

### Test 2: Advanced Settings Still Work (FR-002)

1. With the plugin open, click the advanced settings toggle
2. **Verify**: Width range, height range, Y tolerance, and starting number appear
3. **Verify**: The identifier field is NOT duplicated inside advanced settings
4. Change width range to 1270–1290, click Run on a section
5. **Verify**: Plugin uses the modified width range (filters differently than defaults)

### Test 3: Dark/Light Theme Compatibility (FR-005)

1. In Figma, switch to dark theme (Preferences → Appearance → Dark)
2. Launch the plugin
3. **Verify**: All text is readable, no hardcoded light-only colors
4. Switch to light theme
5. **Verify**: All text is readable, backgrounds adapt correctly

### Test 4: Results Scroll Containment (FR-009)

1. Open a Figma file with a Section containing 50+ slides
2. Run the plugin on that section
3. **Verify**: Results summary is visible without scrolling
4. **Verify**: Slide details log is scrollable within its container
5. **Verify**: The plugin window does not grow or require resizing

### Test 5: Visual Consistency Check (SC-002)

1. With the plugin open, compare control heights:
   - Section dropdown, identifier input, width/height inputs, Run button
2. **Verify**: All text inputs and select have the same height (28px)
3. **Verify**: Labels use consistent size (11px) and color (secondary text)
4. **Verify**: Field hints use consistent size (10px) and secondary color
