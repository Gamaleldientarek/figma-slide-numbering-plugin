# Changelog

All notable changes to the Slide Numbering plugin are documented here. The
version numbers below correspond to the release notes published in Figma's
plugin version history.

## [1.4.0] — 2026-06-26

### Added
- **Custom number format.** Alongside `1, 2, 3` and `01, 02`, you can now define
  your own template using `#` as the number placeholder — e.g. `Page #` →
  "Page 1". Repeat the hash (`##`) to zero-pad to that width.
- **Refresh button** beside the Section dropdown to re-scan the page for sections
  without closing and reopening the plugin. Shows a brief status message
  ("Refreshing…" → "N sections found").
- **Resizable window.** Drag the bottom-right corner handle to make the plugin
  taller or wider. The chosen size is remembered and restored on next launch.

### Fixed
- **Sections sometimes not loading.** With dynamic-page document access, the
  section list could come up empty until the plugin was reopened. The current
  page is now loaded before listing sections, and the list auto-refreshes on
  page change and when the plugin window regains focus.
- **Refresh button placement** in the empty state — it now stays aligned next to
  a centered "No sections found" message.
- **Number Slides button no longer compresses** when Advanced settings are
  expanded; the content area scrolls instead of squashing controls.
- Removed the dated native number-input spinner arrows on the Advanced fields.

### Changed
- **UI modernization pass:** consistent 8px-radius rhythm, taller 32px controls,
  and more breathing room across the header, cards, toggles, and results.
- **New slim scrollbar** with a short, capped thumb that floats inside the frame
  (never touching the edges) and only appears when content actually overflows.

## [1.3.0]

### Added
- Option to exclude cover slides from numbering (slides without a number layer
  no longer consume a page number when "Skip covers" is selected).

## [1.2.0]

### Added
- First-run onboarding guide with a quick-start walkthrough.
- Number format toggle: plain (`1, 2, 3`) and zero-padded (`01, 02, 03`).

### Changed
- General UI polish and refinements.

## [1.1.0]

### Changed
- Brand color updated to orange (#E16105).

### Fixed
- `networkAccess.allowedDomains` corrected to an array.
- Plugin ID configuration.

## [1.0.0]

### Added
- Initial release: sequential slide numbering for slides arranged in a Figma
  section, read left → right then top → bottom, identifying the page-number
  text layer by name (`{p#}`).
