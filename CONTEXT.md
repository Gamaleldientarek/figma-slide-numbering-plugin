# Figma Slide Numbering Plugin — Context

## What This Plugin Does
A standalone Figma plugin that applies sequential page numbers to presentation slides arranged in a Figma section. It reads slide positions (top-to-bottom, left-to-right), identifies the page number text layer, and sets correct sequential numbers.

## Background
This was originally done via CLI eval commands on the file **"CJM (الطالب والمتعافي)"**, page **"تقرير البحث التعافي"**, **Section 1**. The plugin makes this reusable without the CLI.

## How Slides Are Structured

### Section Layout
- Slides are direct children of a **SECTION** node
- Mixed with non-slide elements (groups, images, shapes) that must be filtered out
- Slides are arranged in **rows** (same Y position ±50px), reading left-to-right

### Slide Detection
- **Type:** `FRAME`, `COMPONENT`, `INSTANCE`, or `COMPONENT_SET`
- **Size:** width 1900–1950px, height 1070–1090px
- Non-slide children (different sizes, GROUP type, etc.) are ignored

### Page Number Layer
- Located at: `slide → footer-master → page-no- → {p#}`
- The text node is identified by its **name** containing `{p#}` (not its text content)
- The node's `.characters` holds the actual page number string (e.g., "3", "42")

### Cover Slides
- Some slides have **no `{p#}` text layer** — these are chapter covers
- Covers still **count** in the page sequence but display no number
- Typically one cover per row, always the leftmost slide

## Proven Numbering Algorithm

```javascript
// 1. Get section children
const section = page.children.find(c => c.type === 'SECTION' && c.name === 'Section 1');

// 2. Filter to slides only
const slides = section.children.filter(c => {
  const w = Math.round(c.width);
  const h = Math.round(c.height);
  return ['FRAME','COMPONENT','INSTANCE','COMPONENT_SET'].includes(c.type)
    && w >= 1900 && w <= 1950
    && h >= 1070 && h <= 1090;
});

// 3. Sort by visual position: Y (rows) then X (columns)
slides.sort((a, b) => {
  const yDiff = Math.abs(a.y - b.y);
  if (yDiff > 50) return a.y - b.y;  // Different rows
  return a.x - b.x;                    // Same row, left to right
});

// 4. Find {p#} text node by NAME (not content)
function findPageNumNode(node) {
  if (node.type === 'TEXT' && node.name && node.name.includes('{p#}')) return node;
  if ('children' in node) {
    for (const child of node.children) {
      const found = findPageNumNode(child);
      if (found) return found;
    }
  }
  return null;
}

// 5. Assign numbers (must load font first!)
let pageNum = 0;
for (const slide of slides) {
  pageNum++;
  const pNode = findPageNumNode(slide);
  if (!pNode) continue; // Cover slide — counted but skipped

  const fontName = pNode.fontName;
  if (fontName !== figma.mixed) {
    await figma.loadFontAsync(fontName);
  }
  pNode.characters = String(pageNum);
}
```

## Real Data (Section 1)
| Metric | Value |
|--------|-------|
| Total section children | 127 |
| Actual slides | 96 |
| Slides with `{p#}` (numbered) | 82 |
| Cover slides (no `{p#}`) | 14 |
| Non-slide elements | 31 |
| Rows | 14 |
| Final page number | 96 |

## UI Controls Needed
| Control | Default | Purpose |
|---------|---------|---------|
| Section dropdown | (auto-populated) | Which section to number |
| Page number identifier | `{p#}` | Text node name pattern to match |
| Width range | 1900–1950 | Slide width filter |
| Height range | 1070–1090 | Slide height filter |
| Y tolerance | 50px | Row grouping threshold |
| Starting number | 1 | First page number |
| Run button | — | Execute numbering |
| Results log | — | Total, updated, skipped, errors |

## Plugin File Structure
```
figma-slide-numbering/
├── manifest.json       # Plugin config (offline, no network)
├── code.js             # Numbering engine + message handling
├── ui.html             # Controls + results UI
└── CONTEXT.md          # This file
```

## Key Gotchas
1. **Search by node NAME, not text content** — `{p#}` is the layer name, not what's displayed
2. **Font must be loaded** before setting `.characters` — call `figma.loadFontAsync(fontName)` first
3. **Mixed fonts** — if `fontName === figma.mixed`, iterate character ranges to load all fonts
4. **Component instances** — the `{p#}` text node is inside a component instance (`footer-master`); setting `.characters` on instance children creates overrides per-instance
5. **Size filtering** — some non-slide frames exist; the width/height filter is essential
6. **Row tolerance** — slides in the same row can differ by up to ~50px in Y position
