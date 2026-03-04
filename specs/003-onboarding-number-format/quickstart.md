# Quickstart: Plugin Onboarding & Number Format

**Branch**: `003-onboarding-number-format` | **Date**: 2026-03-04

Manual integration scenarios for validating the feature after implementation. All tests require the plugin loaded in Figma Desktop via the development manifest.

---

## Prerequisite

Import the plugin: **Plugins → Development → Import plugin from manifest…** → select `manifest.json`.

---

## Scenario 1 — First-Time Onboarding (US1)

**Goal**: Verify the onboarding screen appears on first launch.

**Setup**: Clear the onboarding state to simulate a fresh install:
1. Open the plugin
2. If you see the main UI (not onboarding), open the browser console in Figma Desktop's plugin DevTools
3. Or: if a reset button exists during development, use it. Otherwise simulate by calling `figma.clientStorage.deleteAsync('onboardingSeen')` via a temporary handler.

**Steps**:
1. Open the plugin with no `onboardingSeen` key in clientStorage
2. Verify the **onboarding view** is shown (not the main form)
3. Verify onboarding content includes:
   - What the plugin does (brief description)
   - A concrete example of naming a text layer `{p#}`
   - Reading order: left-to-right within rows, top-to-bottom across rows (with visual diagram)
4. Click **"Got it"** button
5. Verify the **main UI** appears (section dropdown, identifier field, number format control, etc.)
6. Close the plugin, reopen it
7. Verify the **main UI** opens directly — no onboarding shown

**Pass criteria**:
- [ ] Onboarding shown on first open
- [ ] Dismiss transitions to main UI
- [ ] Main UI opens directly on second launch

---

## Scenario 2 — Help Trigger Re-opens Onboarding (US2)

**Goal**: Verify the help trigger works and preserves form values.

**Setup**: The plugin should be showing the main UI (onboarding already dismissed).

**Steps**:
1. In the main UI, set the identifier field to a custom value (e.g., `page-num`)
2. Select a section from the dropdown
3. Click the **? help trigger** (icon in the header)
4. Verify the **onboarding view** appears with the same content as first-time onboarding
5. Click **"Got it"** (or the same dismiss button)
6. Verify the **main UI** returns
7. Verify the identifier field still shows `page-num` (value preserved)
8. Verify the section dropdown still shows the previously selected section

**Pass criteria**:
- [ ] Help trigger is visible in the main UI header
- [ ] Clicking it shows onboarding
- [ ] Dismissing returns to main UI
- [ ] Form values are preserved after round-trip

---

## Scenario 3 — Zero-Padded Number Format (US3, 15 slides)

**Goal**: Verify zero-padding produces 01–09 for slides 1–9 and 10–15 without padding.

**Setup**: A Figma section with at least 15 slide frames, each containing a `{p#}` text layer.

**Steps**:
1. Open the plugin — main UI shown
2. Select the section with 15+ slides
3. Find the number format control — verify **"1, 2, 3"** (plain) is active by default
4. Click **"01, 02, 03"** to select zero-padded format
5. Click **Number Slides**
6. Open Figma and inspect the `{p#}` layers:
   - Slide 1 → `"01"`
   - Slide 9 → `"09"`
   - Slide 10 → `"10"`
   - Slide 15 → `"15"`

**Pass criteria**:
- [ ] "1, 2, 3" (plain) is the default on plugin open
- [ ] Switching to "01, 02, 03" is reflected in results
- [ ] Slides 1–9 show two-digit zero-padded values
- [ ] Slides 10–15 show unpadded values

---

## Scenario 4 — Plain Format (Default, US3)

**Goal**: Verify plain format produces the same output as before this feature.

**Steps**:
1. Open the plugin — main UI shown
2. Do not change the number format control (leave as "1, 2, 3")
3. Run the plugin on a 10-slide section
4. Verify all slides show `"1"` through `"10"` with no leading zeros

**Pass criteria**:
- [ ] Plain format is identical to pre-feature behavior
- [ ] No leading zeros on any slide

---

## Scenario 5 — Number Format Resets on Relaunch (FR-009)

**Goal**: Verify the number format setting does not persist between sessions.

**Steps**:
1. Select **"01, 02, 03"** (zero-padded) format
2. Close the plugin
3. Reopen the plugin
4. Verify the format control shows **"1, 2, 3"** (plain) — not the previously selected zero-padded option

**Pass criteria**:
- [ ] Number format always resets to plain on plugin launch

---

## Scenario 6 — Help Trigger Inactive During Run

**Goal**: Edge case — verify help trigger does not interrupt an in-progress run.

> Note: This scenario is difficult to test manually since runs complete quickly for small sections. For a large section (20+ slides showing the Cancel notification), attempt to click the help trigger and verify it has no effect or is visually disabled.

**Pass criteria**:
- [ ] Help trigger does not open onboarding while the run button is disabled/running
