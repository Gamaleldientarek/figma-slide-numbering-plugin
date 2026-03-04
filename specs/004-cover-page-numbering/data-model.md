# Data Model: Cover Page Numbering Option

**Feature**: 004-cover-page-numbering | **Date**: 2026-03-04

## Entities

### Config (extended)

The existing configuration object passed from UI to backend. This feature adds one field:

| Field         | Type    | Default | Description                                             |
| ------------- | ------- | ------- | ------------------------------------------------------- |
| countCovers   | boolean | true    | Whether cover slides consume a number in the sequence   |

Existing fields (unchanged): `sectionId`, `identifier`, `zeroPadded`, `startingNumber`, `widthMin`, `widthMax`, `heightMin`, `heightMax`, `yTolerance`

### Result (extended)

The existing result object returned from backend to UI. No new fields — existing fields suffice:

| Field        | Type   | Description                                                        |
| ------------ | ------ | ------------------------------------------------------------------ |
| totalSlides  | number | Count of all detected slides                                       |
| updated      | number | Slides that received a page number                                 |
| skipped      | number | Cover slides (no page-number layer)                                |
| errors       | number | Slides that failed                                                 |
| slideDetails | array  | Per-slide: `{ name, pageNumber, status }` where status is 'updated', 'cover', or 'error' |

**Note**: When `countCovers` is OFF, `pageNumber` in `slideDetails` for cover slides will show `null` or `"-"` instead of the consumed number, since covers don't consume a number.

### Persisted Settings

Stored in `figma.clientStorage` (per-device, per-plugin):

| Key           | Type    | Default | Description                       |
| ------------- | ------- | ------- | --------------------------------- |
| countCovers   | boolean | true    | Persisted cover-counting preference |
| zeroPadded    | boolean | false   | (existing) Zero-padding preference  |
| onboardingSeen | boolean | false  | (existing) Onboarding dismissal     |

## State Transitions

The `countCovers` setting has no state machine — it is a simple boolean toggle. The value flows:

1. **Load**: Read from `figma.clientStorage.getAsync('countCovers')` on plugin open → default `true` if absent
2. **Display**: Reflected in UI segmented toggle
3. **Use**: Sent as part of config on "run-numbering" message
4. **Save**: Written to `figma.clientStorage.setAsync('countCovers', value)` on toggle change
