# Slide Numbering — Figma Plugin

Automatically number slides in a Figma section. Works with any presentation layout — just add a text layer with the identifier pattern to each slide and run the plugin.

---

## Features

- **Section-based**: Pick any section on the page and number its slides
- **Smart sorting**: Slides are numbered left-to-right within each row, rows are processed top-to-bottom
- **Flexible identifier**: Name your page number text layer anything containing your chosen identifier (default: `{p#}`)
- **Cover slide support**: Slides without the identifier layer are automatically skipped (treated as covers)
- **Configurable**: Starting number, slide size filter, and row tolerance are all adjustable
- **Per-slide log**: See exactly what happened to every slide after each run

---

## Installation

> This plugin is not yet published to the Figma Community. Install it as a local development plugin:

1. Clone or download this repository
2. Open Figma Desktop
3. Go to **Plugins → Development → Import plugin from manifest…**
4. Select the `manifest.json` file from this repository
5. The plugin is now available under **Plugins → Development → Slide Numbering**

See [QUICK_SETUP.md](QUICK_SETUP.md) for a full walkthrough with screenshots.

---

## Quick Start

1. In your Figma file, place all slide frames inside a **Section**
2. Add a **Text layer** named `{p#}` inside each slide you want numbered
3. Open the plugin: **Plugins → Development → Slide Numbering**
4. Select your section from the dropdown
5. Click **Number Slides**

---

## How It Works

### Page Number Layer

Each slide that should receive a number needs a text layer whose name **contains** the identifier string. The default identifier is `{p#}`.

```
Section
├── Slide 1 (Frame)
│   ├── Background
│   ├── Title
│   └── {p#}          ← text layer — will be set to "1"
├── Cover (Frame)     ← no {p#} layer — skipped automatically
│   └── Title
└── Slide 2 (Frame)
    ├── Background
    └── {p#}          ← text layer — will be set to "2"
```

The text layer can be nested anywhere inside the slide frame — the plugin searches all descendants.

### Slide Ordering

Slides are sorted **left-to-right** within each row, and rows are ordered **top-to-bottom**. This matches the natural reading order of a grid layout:

```
[1] [2] [3]
[4] [5] [6]
[7] [8] [9]
```

Frames within 20px of each other vertically are treated as the same row (configurable via Y Tolerance in Advanced Settings).

---

## Configuration

### Primary Controls

| Control | Default | Description |
|---------|---------|-------------|
| Section | — | The section containing your slides |
| Page Number Identifier | `{p#}` | String that the page number text layer name must contain |

### Advanced Settings

| Control | Default | Description |
|---------|---------|-------------|
| Min / Max Width | 100–9999 | Filter slides by width (px) |
| Min / Max Height | 100–9999 | Filter slides by height (px) |
| Y Tolerance | 20 | Max vertical gap (px) to treat frames as the same row |
| Starting Number | 1 | The number assigned to the first detected slide |

---

## Results

After running, the plugin shows:

- **Total slides**: All frames in the section matching the size filter
- **Updated**: Slides where the page number was written successfully
- **Skipped**: Slides with no identifier layer (covers, title slides, etc.)
- **Errors**: Slides where writing failed (e.g., missing font)

A scrollable per-slide log shows the outcome for every slide.

---

## Made with

Made with ❤️ by [Gamal Eldien](https://gamaleldien.com/)

---

## License

MIT
