# Quickstart: Cover Page Numbering Option

**Feature**: 004-cover-page-numbering

## What This Feature Does

Adds a toggle to the slide numbering plugin that controls whether cover slides (slides without a page-number layer) consume a number in the sequence. When turned off, content slides are numbered consecutively without gaps.

## Files to Change

1. **`ui.html`** — Add the "Count covers" segmented toggle to the primary controls card; load/save the setting via `figma.clientStorage`; update results display for cover slide details.

2. **`code.js`** — Modify `numberSlides()` to conditionally skip incrementing `pageNum` for cover slides when `countCovers` is `false`; adjust zero-padding calculation to pre-scan non-cover count.

3. **`tests/`** — Add test cases for: covers not counted (gap-free numbering), covers counted (existing behavior), interaction with starting number and zero-padding, persistence default.

## Key Implementation Notes

- The segmented toggle should match the style of the existing zero-padding toggle
- Default is `true` (ON) to preserve backward compatibility
- The `figma.clientStorage` key is `countCovers`
- Zero-padding width must be recalculated based on actual numbered slide count when covers are excluded
- The results `slideDetails` for cover slides should show no page number when covers are not counted
