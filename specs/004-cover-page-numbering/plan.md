# Implementation Plan: Cover Page Numbering Option

**Branch**: `004-cover-page-numbering` | **Date**: 2026-03-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-cover-page-numbering/spec.md`

## Summary

Add a toggle to the plugin UI that controls whether cover slides (slides without a page-number layer) consume a number in the sequence. When OFF, only content slides receive and consume sequential numbers, producing gap-free visible numbering. The setting persists via `figma.clientStorage` and defaults to ON for backward compatibility.

## Technical Context

**Language/Version**: JavaScript (ES2020+ — Figma plugin sandbox)
**Primary Dependencies**: Figma Plugin API (built-in, no external packages)
**Storage**: `figma.clientStorage` (per-plugin, per-device key-value store)
**Testing**: Node.js test runner (`npm test`) with mock Figma API
**Target Platform**: Figma desktop & web (plugin sandbox)
**Project Type**: Figma plugin
**Performance Goals**: N/A — plugin operates on <1000 slides; sub-second execution
**Constraints**: No network access, no external packages, single-file plugin code (`code.js` + `ui.html`)
**Scale/Scope**: Single toggle addition; touches numbering engine, UI, and persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is an unfilled template — no project-specific gates defined. Proceeding without violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-cover-page-numbering/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
code.js          # Plugin backend — numbering engine, message handling
ui.html          # Plugin UI — controls, results, onboarding
manifest.json    # Plugin metadata
tests/           # Unit tests
```

**Structure Decision**: Flat single-project structure. The plugin is two files (`code.js` and `ui.html`) with no build step. Changes for this feature touch both files plus tests. No contracts directory needed — no external interfaces.

## Complexity Tracking

No constitution violations to justify.
