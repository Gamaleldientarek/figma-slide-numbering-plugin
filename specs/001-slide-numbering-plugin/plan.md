# Implementation Plan: Figma Slide Numbering Plugin

**Branch**: `001-slide-numbering-plugin` | **Date**: 2026-03-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-slide-numbering-plugin/spec.md`

## Summary

Build a standalone Figma plugin that applies sequential page numbers to presentation slides within a Section. The plugin provides a simple UI with configurable slide detection parameters (size, identifier, tolerance), sorts slides by visual reading order, and updates page number text layers. No external dependencies, no network access — runs entirely within Figma's plugin sandbox.

## Technical Context

**Language/Version**: JavaScript (ES2020+ — Figma plugin sandbox)
**Primary Dependencies**: Figma Plugin API (built-in, no external packages)
**Storage**: N/A (no persistence — settings reset each launch per FR-013)
**Testing**: Manual testing via Figma plugin import + visual verification
**Target Platform**: Figma Desktop (plugin sandbox)
**Project Type**: Single project (3 files: manifest.json, code.js, ui.html)
**Performance Goals**: Process 200 slides in under 5 seconds
**Constraints**: Offline-capable, no network access, no build step required
**Scale/Scope**: Single plugin, 3 files, ~300–400 lines total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is an uninitialized template — no project-specific principles defined. No gates to evaluate. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/001-slide-numbering-plugin/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
figma-slide-numbering/
├── manifest.json        # Figma plugin manifest
├── code.js              # Plugin main thread (numbering engine + message handling)
├── ui.html              # Plugin UI (controls + results)
└── CONTEXT.md           # Design context document (already exists)
```

**Structure Decision**: Flat 3-file structure. Figma plugins require manifest.json + main code file + optional UI file. No build tooling, no src/ directory — files are served directly by Figma's plugin loader. This matches the existing FigCli plugin pattern at `figma-cli-main/plugin/`.
