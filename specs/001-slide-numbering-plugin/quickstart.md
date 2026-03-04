# Quickstart: Figma Slide Numbering Plugin

## Prerequisites

- Figma Desktop app installed
- A Figma file with slides arranged in a Section

## Installation

1. Clone or download the `figma-slide-numbering/` folder
2. Open Figma Desktop
3. Go to **Plugins → Development → Import plugin from manifest...**
4. Select `figma-slide-numbering/manifest.json`
5. The plugin "Slide Numbering" now appears under Plugins → Development

## Usage

1. Open the Figma file containing your slides
2. Navigate to the page with the target Section
3. Run: **Plugins → Development → Slide Numbering**
4. Select the section from the dropdown
5. Adjust settings if needed (identifier, size range, tolerance, starting number)
6. Click **Run**
7. Review the results log (total, updated, skipped, errors)
8. Use **Ctrl+Z / Cmd+Z** to undo if needed

## Default Settings

| Setting | Default | Adjust when... |
|---------|---------|----------------|
| Identifier | `{p#}` | Your page number layers use a different name |
| Width | 1900–1950 | Your slides are a different width |
| Height | 1070–1090 | Your slides are a different height |
| Y Tolerance | 50px | Slides in the same row have larger/smaller Y differences |
| Starting Number | 1 | You want numbering to start from a different number |

## How It Works

1. **Detect**: Finds all frames in the section matching the size filter
2. **Sort**: Groups by Y position (rows), then sorts left-to-right by X
3. **Number**: Walks through sorted slides, assigns sequential numbers to `{p#}` text layers
4. **Skip covers**: Slides without a `{p#}` layer are counted but not labeled

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No sections found" | Make sure you're on the correct page and it has Section nodes |
| "No slides found" | Adjust the width/height range to match your slide dimensions |
| Font errors | The slide's page number text uses a font not available — check Figma's font settings |
| Wrong order | Adjust Y tolerance if slides in the same row aren't being grouped together |
