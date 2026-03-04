# Research: Cover Page Numbering Option

**Feature**: 004-cover-page-numbering | **Date**: 2026-03-04

## R1: Where to place the toggle in the UI

**Decision**: Place in the primary controls card, below the number format toggle and above the advanced settings collapsible.

**Rationale**: The cover-counting option directly affects visible numbering output and is a primary workflow decision — not an obscure calibration setting. Placing it alongside the number format toggle keeps related numbering options grouped. Advanced settings (width/height ranges, Y tolerance) are calibration-level controls that most users never touch.

**Alternatives considered**:
- Inside advanced settings: Lower discoverability; users may not find it
- As a separate card: Overcomplicates the UI for a single toggle

## R2: Toggle UI pattern — consistent with existing number format toggle

**Decision**: Use the same segmented button pattern as the zero-padding toggle ("1, 2, 3" / "01, 02, 03"), adapted with labels like "Count all slides" / "Skip covers".

**Rationale**: Reusing the existing toggle pattern maintains visual consistency. The segmented button is already established in the UI and understood by users.

**Alternatives considered**:
- Checkbox: Less visually prominent; inconsistent with existing toggle pattern
- Dropdown: Overkill for a binary choice

## R3: Persistence key naming

**Decision**: Use `countCovers` as the `figma.clientStorage` key, storing a boolean (`true`/`false`).

**Rationale**: Follows the existing pattern of `zeroPadded` (boolean) and `onboardingSeen` (boolean). Short, descriptive, and consistent with the codebase naming convention.

**Alternatives considered**:
- `skipCovers` (inverted logic): More confusing — double-negative when set to `false`
- `coverCountingMode` (string enum): Over-engineered for a binary choice

## R4: Numbering engine change — where to modify

**Decision**: Modify the `numberSlides()` function in `code.js`. When `countCovers` is `false` and a slide has no page-number layer, do NOT increment `pageNum`. The change is a single conditional: only increment the counter when the slide either has a page-number layer OR `countCovers` is `true`.

**Rationale**: Minimal change to existing logic. Currently, `pageNum` increments for every slide regardless. The fix is to conditionally skip the increment for cover slides when the setting is OFF.

**Alternatives considered**:
- Two-pass approach (count non-covers first, then number): Unnecessary complexity for the same result
- Pre-filtering covers out of the slide list: Would break the results reporting which needs to know about covers

## R5: Zero-padding calculation when covers are not counted

**Decision**: When `countCovers` is OFF, calculate padding width based on the count of non-cover slides (plus starting number minus 1), not total slides. This requires a pre-scan to count non-cover slides before numbering.

**Rationale**: If there are 3 content slides starting at 1, the highest number is 3 (single digit) — padding to "01" would be wrong if based on total of 10 slides. The pre-scan is lightweight (just checking for the identifier layer existence).

**Alternatives considered**:
- Always pad based on total slides: Would over-pad when many covers exist
- Skip pre-scan, pad based on total: Simpler but incorrect padding width
