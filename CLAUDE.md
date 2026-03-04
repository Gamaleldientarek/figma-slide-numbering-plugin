# figma-slide-numbering Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-04

## Active Technologies
- JavaScript (ES2020+ — Figma plugin sandbox) + HTML/CSS (inline in ui.html) + Figma Plugin API (built-in) — specifically `figma.clientStorage` for persistence (003-onboarding-number-format)
- `figma.clientStorage.getAsync` / `figma.clientStorage.setAsync` — per-plugin, per-device key-value store (003-onboarding-number-format)

- JavaScript (ES2020+ — Figma plugin sandbox) + HTML/CSS (inline in ui.html) + Figma Plugin API (built-in, no external packages) (002-ui-polish)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript (ES2020+ — Figma plugin sandbox) + HTML/CSS (inline in ui.html): Follow standard conventions

## Recent Changes
- 003-onboarding-number-format: Added JavaScript (ES2020+ — Figma plugin sandbox) + HTML/CSS (inline in ui.html) + Figma Plugin API (built-in) — specifically `figma.clientStorage` for persistence

- 002-ui-polish: Added JavaScript (ES2020+ — Figma plugin sandbox) + HTML/CSS (inline in ui.html) + Figma Plugin API (built-in, no external packages)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
