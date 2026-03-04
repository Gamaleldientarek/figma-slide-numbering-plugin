# Data Model: Figma Slide Numbering Plugin

## Entities

### PluginConfig (transient — UI form state, not persisted)

| Field | Type | Default | Validation |
|-------|------|---------|------------|
| sectionId | string | (first section on page) | Must be a valid section node ID |
| identifier | string | `{p#}` | Non-empty string |
| minWidth | number | 1900 | > 0 |
| maxWidth | number | 1950 | >= minWidth |
| minHeight | number | 1070 | > 0 |
| maxHeight | number | 1090 | >= minHeight |
| yTolerance | number | 50 | >= 0 |
| startingNumber | number | 1 | >= 0, integer |

### SectionInfo (read from Figma, sent to UI for dropdown)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Figma node ID |
| name | string | Section display name |

### SlideInfo (internal, used during processing)

| Field | Type | Description |
|-------|------|-------------|
| nodeId | string | Figma node ID of the slide frame |
| name | string | Slide name (for results log) |
| x | number | X position |
| y | number | Y position |
| hasPageNum | boolean | Whether a matching page number text node was found |
| pageNumNodeId | string or null | ID of the {p#} text node if found |

### NumberingResult (sent from code.js to UI after run)

| Field | Type | Description |
|-------|------|-------------|
| totalSlides | number | Total slides detected matching size filter |
| updated | number | Slides whose page number was set |
| skipped | number | Cover slides (no page number layer) |
| errors | array of ErrorEntry | Slides that failed |

### ErrorEntry

| Field | Type | Description |
|-------|------|-------------|
| slideName | string | Name of the slide that failed |
| pageNumber | number | The page number that was attempted |
| message | string | Error description (e.g., "Font loading failed") |

## Relationships

```
Page 1──* Section 1──* Slide
                         │
                         ├── 0..1 PageNumberLayer (text node matching identifier)
                         │
                         └── type: "cover" (no PageNumberLayer)
                              or "numbered" (has PageNumberLayer)
```

## State Transitions

The plugin has no persistent state. The UI form represents a single transient configuration that resets on each launch. The processing flow is:

```
IDLE → (user clicks Run) → PROCESSING → COMPLETE (results displayed)
                                ↓
                           ERROR (partial results + error list)
```

## Message Protocol (code.js ↔ ui.html)

### UI → code.js

| Message Type | Payload | When |
|-------------|---------|------|
| `get-sections` | (none) | On plugin launch |
| `run-numbering` | PluginConfig | User clicks Run |

### code.js → UI

| Message Type | Payload | When |
|-------------|---------|------|
| `sections-list` | SectionInfo[] | Response to get-sections |
| `numbering-complete` | NumberingResult | After processing finishes |
| `no-sections` | (none) | Current page has no sections |
