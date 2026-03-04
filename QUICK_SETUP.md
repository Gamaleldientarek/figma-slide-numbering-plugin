# Quick Setup Guide — Slide Numbering Plugin

This guide walks you through setting up and using the Slide Numbering plugin in Figma Desktop from scratch.

---

## Step 1 — Install the Plugin

1. Download or clone this repository to your computer
2. Open **Figma Desktop** (the plugin requires the desktop app — it will not work in the browser)
3. Open any Figma file
4. In the menu bar, go to **Plugins → Development → Import plugin from manifest…**
5. Navigate to the folder where you saved this repository and select `manifest.json`
6. The plugin is now installed and appears under **Plugins → Development → Slide Numbering**

> You only need to do this once. The plugin stays installed across files.

---

## Step 2 — Set Up Your Slides

The plugin needs two things in your Figma file:

### A. Place slides inside a Section

Create a **Section** (not a frame) and put all your slide frames inside it.

To create a section: select frames on the canvas → right-click → **Add Section**, or press **S** after selecting frames.

```
Page
└── My Presentation    ← Section
    ├── Slide 01       ← Frame
    ├── Slide 02       ← Frame
    └── Slide 03       ← Frame
```

### B. Add a page number text layer to each slide

Inside each slide you want numbered, add a **Text layer** and name it so it contains `{p#}`.

The easiest way:
1. Double-click a slide frame to enter it
2. Press **T** to create a text layer
3. Place it where you want the page number to appear
4. Rename the layer: double-click the layer name in the Layers panel and type `{p#}`

```
Slide 01 (Frame)
├── Background
├── Title
├── Content
└── {p#}              ← this is your page number layer
```

> The text content doesn't matter — the plugin will overwrite it with the page number.
> The layer can be nested inside groups or components; the plugin searches all descendants.

**Cover slides** (title slide, section dividers, etc.) that you don't want numbered? Just don't add a `{p#}` layer — the plugin will automatically skip them.

---

## Step 3 — Run the Plugin

1. Open the plugin: **Plugins → Development → Slide Numbering**
2. Select your **section** from the dropdown
3. Confirm the **Page Number Identifier** is `{p#}` (or change it to match your layer names)
4. Click **Number Slides**

The plugin will:
- Find all slide frames in the section matching the size filter
- Sort them left-to-right, top-to-bottom
- Write the page number into each `{p#}` text layer
- Show you a summary of what happened

---

## Step 4 — Review Results

After running, you'll see:

| Metric | Meaning |
|--------|---------|
| Total slides | Frames detected in the section matching size filters |
| Updated | Slides where the page number was written |
| Skipped | Slides with no `{p#}` layer (covers/dividers) |
| Errors | Slides where writing failed (see error log for details) |

The **per-slide log** below the summary shows every slide individually — great for spotting which slides were skipped or had errors.

---

## Common Issues

### "No slides found"

The plugin couldn't find any frames matching the size filter in your section.

**Check:**
- Your frames are direct children of the section (not nested inside another frame)
- The Min/Max Width and Height in Advanced Settings match your actual slide dimensions
- You selected the correct section

The plugin shows sample slide sizes at the bottom when this happens — use those to adjust the size filter.

### "Skipped" slides I expected to be numbered

The plugin looks for a text layer whose name **contains** the identifier string (`{p#}` by default).

**Check:**
- The text layer name includes `{p#}` (check the Layers panel — names like `Page Number` won't match)
- The identifier in the plugin matches what you named your layer
- The layer is inside the slide frame (not outside it)

### Font errors

If a slide has a missing or unloaded font, the plugin cannot edit that text layer. You'll see it listed as an error.

**Fix:** Ensure all fonts used in `{p#}` layers are available on your machine.

### Numbers are out of order

The plugin sorts slides by their position on the canvas (left-to-right, then top-to-bottom). If your slides are visually aligned correctly but numbers are wrong, check for small positional misalignments.

You can increase the **Y Tolerance** in Advanced Settings to widen the same-row detection range.

---

## Advanced Tips

### Custom identifier

If you prefer a different naming convention, change the **Page Number Identifier** field. For example, set it to `page-num` and name your text layers `page-num` or `footer/page-num` — anything containing that string.

### Starting number

Use the **Starting Number** setting in Advanced Settings to start from a number other than 1. Useful for multi-section presentations where each section is numbered independently.

### Re-running safely

The plugin overwrites the text content of the `{p#}` layer every time. Running it multiple times is safe — it always produces the same result.

---

## Need Help?

Visit [gamaleldien.com](https://gamaleldien.com/) or open an issue on GitHub.
