// Slide Numbering Plugin — code.js
// Main thread: runs in Figma plugin sandbox (ES2020+)

figma.showUI(__html__, { width: 320, height: 560, themeColors: true });

// ---------------------------------------------------------------------------
// T006: Slide detection
// ---------------------------------------------------------------------------
function detectSlides(section, config) {
  return section.children.filter(c => {
    if (!['FRAME', 'COMPONENT', 'INSTANCE', 'COMPONENT_SET'].includes(c.type)) return false;
    const w = Math.round(c.width);
    const h = Math.round(c.height);
    return w >= config.minWidth && w <= config.maxWidth
        && h >= config.minHeight && h <= config.maxHeight;
  });
}

// ---------------------------------------------------------------------------
// T007: Slide sorting — pre-group into rows by Y tolerance, then sort by X
// (Fix C1: transitive row grouping instead of non-transitive comparator)
// ---------------------------------------------------------------------------
function sortSlides(slides, yTolerance) {
  // Sort by Y first to enable row grouping
  const byY = [...slides].sort((a, b) => a.y - b.y);

  // Group into rows: start a new row when the Y gap exceeds tolerance
  const rows = [];
  let currentRow = [];
  for (const slide of byY) {
    if (currentRow.length === 0 || Math.abs(slide.y - currentRow[0].y) <= yTolerance) {
      currentRow.push(slide);
    } else {
      rows.push(currentRow);
      currentRow = [slide];
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  // Sort each row left-to-right by X, then flatten
  for (const row of rows) {
    row.sort((a, b) => a.x - b.x);
  }
  return rows.flat();
}

// ---------------------------------------------------------------------------
// T008: Page number layer finder — depth-first search for TEXT node by name
// ---------------------------------------------------------------------------
function findPageNumNode(node, identifier) {
  if (node.type === 'TEXT' && node.name && node.name.includes(identifier)) {
    return node;
  }
  if ('children' in node) {
    for (const child of node.children) {
      const found = findPageNumNode(child, identifier);
      if (found) return found;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// T009: Numbering engine — load fonts, assign sequential numbers, skip covers
// (Fix M2: cancellation support for large sections)
// (Fix m8: undo grouping so Cmd+Z reverts the whole operation)
// ---------------------------------------------------------------------------
async function numberSlides(slides, config) {
  // T018: slideDetails carries per-slide info for the results log in ui.html
  const result = { totalSlides: slides.length, updated: 0, skipped: 0, errors: [], slideDetails: [] };
  const countCovers = config.countCovers !== false; // default true for backward compat
  let pageNum = config.startingNumber - 1;

  // T002: Pre-scan to count non-cover slides for zero-padding width calculation
  let maxPageNum;
  if (countCovers) {
    maxPageNum = config.startingNumber + slides.length - 1;
  } else {
    const contentCount = slides.filter(s => findPageNumNode(s, config.identifier) !== null).length;
    maxPageNum = config.startingNumber + contentCount - 1;
  }
  const padWidth = String(maxPageNum).length;

  // Cancellation support (M2)
  let cancelled = false;
  let notifyHandle = null;
  if (slides.length > 20) {
    notifyHandle = figma.notify('Numbering slides…', {
      timeout: 0,
      button: { text: 'Cancel', action: () => { cancelled = true; } },
    });
  }

  for (const slide of slides) {
    if (cancelled) {
      if (notifyHandle) notifyHandle.cancel();
      figma.notify('Numbering cancelled.');
      break;
    }

    const pNode = findPageNumNode(slide, config.identifier);

    // T001/T003: When countCovers is false, covers don't consume a number
    if (!pNode) {
      if (countCovers) pageNum++;
      result.skipped++;
      result.slideDetails.push({ name: slide.name, pageNumber: countCovers ? pageNum : null, status: 'cover' });
      continue;
    }

    pageNum++;

    try {
      if (pNode.hasMissingFont) {
        const errMsg = 'Missing font — cannot update this slide.';
        result.errors.push({ slideName: slide.name, pageNumber: pageNum, message: errMsg });
        result.slideDetails.push({ name: slide.name, pageNumber: pageNum, status: 'error' });
        continue;
      }

      if (pNode.fontName === figma.mixed) {
        const fonts = pNode.getRangeAllFontNames(0, pNode.characters.length);
        await Promise.all(fonts.map(f => figma.loadFontAsync(f)));
      } else {
        await figma.loadFontAsync(pNode.fontName);
      }

      // T002: Use pre-calculated padWidth for zero-padding
      let numStr = String(pageNum);
      if (config.zeroPadded) {
        numStr = numStr.padStart(padWidth, '0');
      }
      pNode.characters = numStr;
      result.updated++;
      result.slideDetails.push({ name: slide.name, pageNumber: pageNum, status: 'updated' });
    } catch (err) {
      const errMsg = err.message || 'Unknown error';
      result.errors.push({ slideName: slide.name, pageNumber: pageNum, message: errMsg });
      result.slideDetails.push({ name: slide.name, pageNumber: pageNum, status: 'error' });
    }
  }

  if (notifyHandle && !cancelled) notifyHandle.cancel();
  return result;
}

// ---------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {

    // 003: Onboarding state — read from clientStorage
    case 'get-onboarding-state': {
      const val = await figma.clientStorage.getAsync('onboardingSeen');
      figma.ui.postMessage({ type: 'onboarding-state', hasSeen: !!val });
      break;
    }

    // 003: Persist onboarding dismissed state
    case 'set-onboarding-seen': {
      await figma.clientStorage.setAsync('onboardingSeen', true);
      break;
    }

    // 004: Read persisted countCovers setting
    case 'get-count-covers': {
      const val = await figma.clientStorage.getAsync('countCovers');
      figma.ui.postMessage({ type: 'count-covers-state', countCovers: val !== false });
      break;
    }

    // 004: Persist countCovers setting
    case 'set-count-covers': {
      await figma.clientStorage.setAsync('countCovers', msg.countCovers);
      break;
    }

    case 'get-sections': {
      const sections = figma.currentPage.children
        .filter(c => c.type === 'SECTION')
        .map(c => ({ id: c.id, name: c.name }));

      if (sections.length === 0) {
        figma.ui.postMessage({ type: 'no-sections' });
      } else {
        figma.ui.postMessage({ type: 'sections-list', sections });
      }
      break;
    }

    // T010: run detection → sort → number pipeline
    case 'run-numbering': {
      const config = msg.config;

      // Fix M3: use direct children lookup instead of deep findOne traversal
      const section = figma.currentPage.children.find(n => n.id === config.sectionId);

      if (!section || section.type !== 'SECTION') {
        figma.ui.postMessage({
          type: 'numbering-complete',
          result: { totalSlides: 0, updated: 0, skipped: 0, errors: [{ slideName: '—', pageNumber: 0, message: 'Section not found.' }] },
        });
        break;
      }

      const slides = detectSlides(section, config);

      if (slides.length === 0) {
        const sample = section.children
          .filter(c => ['FRAME', 'COMPONENT', 'INSTANCE', 'COMPONENT_SET'].includes(c.type))
          .slice(0, 10)
          .map(c => `${Math.round(c.width)}×${Math.round(c.height)}`);
        const unique = [...new Set(sample)];
        figma.ui.postMessage({
          type: 'numbering-complete',
          result: { totalSlides: 0, updated: 0, skipped: 0, errors: [], diagnosticSizes: unique },
        });
        break;
      }

      const sorted = sortSlides(slides, config.yTolerance);
      const result = await numberSlides(sorted, config);
      figma.ui.postMessage({ type: 'numbering-complete', result });
      break;
    }

    case 'open-url': {
      figma.openExternal(msg.url);
      break;
    }

    default:
      console.warn('Unhandled message type:', msg.type);
  }
};
