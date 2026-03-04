# Message Protocol Contract: Plugin Onboarding & Number Format

**Branch**: `003-onboarding-number-format` | **Date**: 2026-03-04

This document defines the complete message protocol between `ui.html` (plugin iframe) and `code.js` (plugin main thread) after this feature is implemented. Existing messages from prior features are included for completeness.

---

## UI → Plugin Messages

### `get-onboarding-state` *(NEW)*

Sent immediately on plugin load to determine whether to show the onboarding view.

```javascript
{ type: 'get-onboarding-state' }
```

**When**: On `window` load event, before rendering any view.
**Reply**: `onboarding-state`

---

### `set-onboarding-seen` *(NEW)*

Sent when the user dismisses the onboarding panel for the first time (clicks "Got it").

```javascript
{ type: 'set-onboarding-seen' }
```

**When**: User clicks the dismiss button on `#onboarding-view`.
**Effect**: `code.js` writes `clientStorage.setAsync('onboardingSeen', true)`. No reply message.
**Note**: NOT sent when onboarding is opened via the help trigger and then dismissed — the seen state is already `true` at that point.

---

### `get-sections` *(existing)*

```javascript
{ type: 'get-sections' }
```

---

### `run-numbering` *(CHANGED — adds `zeroPadded`)*

```javascript
{
  type: 'run-numbering',
  config: {
    sectionId: string,       // Figma node ID of the selected section
    identifier: string,      // Page number layer name pattern (e.g. "{p#}")
    minWidth: number,        // Minimum slide width in px
    maxWidth: number,        // Maximum slide width in px
    minHeight: number,       // Minimum slide height in px
    maxHeight: number,       // Maximum slide height in px
    yTolerance: number,      // Max Y gap (px) for same-row detection
    startingNumber: number,  // First page number to assign
    zeroPadded: boolean      // NEW: true = "01", false = "1" (default: false)
  }
}
```

---

### `open-url` *(existing)*

```javascript
{ type: 'open-url', url: string }
```

---

## Plugin → UI Messages

### `onboarding-state` *(NEW)*

Reply to `get-onboarding-state`.

```javascript
{ type: 'onboarding-state', hasSeen: boolean }
```

- `hasSeen: false` (or key missing in storage) → show `#onboarding-view`
- `hasSeen: true` → show `#main-view`

---

### `sections-list` *(existing)*

```javascript
{ type: 'sections-list', sections: [{ id: string, name: string }] }
```

---

### `no-sections` *(existing)*

```javascript
{ type: 'no-sections' }
```

---

### `numbering-complete` *(existing)*

```javascript
{
  type: 'numbering-complete',
  result: {
    totalSlides: number,
    updated: number,
    skipped: number,
    errors: [{ slideName: string, pageNumber: number, message: string }],
    slideDetails: [{ name: string, pageNumber: number, status: 'updated' | 'cover' | 'error' }],
    diagnosticSizes?: string[]  // present only when totalSlides === 0
  }
}
```

---

## Storage Schema

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `onboardingSeen` | `boolean` | `undefined` (treated as `false`) | Set to `true` when user first dismisses onboarding |

Storage: `figma.clientStorage` — per-plugin, per-device. Cleared if user reinstalls the plugin or clears plugin data.
