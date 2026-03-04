// Slide Numbering Plugin — code.js
// Main thread: runs in Figma plugin sandbox (ES2020+)

figma.showUI(__html__, { width: 320, height: 500, themeColors: true });

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
// T007: Slide sorting — group by Y row (±tolerance), then left-to-right by X
// ---------------------------------------------------------------------------
function sortSlides(slides, yTolerance) {
  return [...slides].sort((a, b) => {
    if (Math.abs(a.y - b.y) > yTolerance) return a.y - b.y;
    return a.x - b.x;
  });
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
// ---------------------------------------------------------------------------
async function numberSlides(slides, config) {
  const result = { totalSlides: slides.length, updated: 0, skipped: 0, errors: [] };
  let pageNum = config.startingNumber - 1;

  let notifyHandle = null;
  if (slides.length > 20) {
    notifyHandle = figma.notify('Numbering slides…', { timeout: Infinity });
  }

  for (const slide of slides) {
    pageNum++;
    const pNode = findPageNumNode(slide, config.identifier);

    if (!pNode) {
      result.skipped++;
      continue;
    }

    try {
      if (pNode.hasMissingFont) {
        result.errors.push({
          slideName: slide.name,
          pageNumber: pageNum,
          message: 'Missing font — cannot update this slide.',
        });
        continue;
      }

      if (pNode.fontName === figma.mixed) {
        const fonts = pNode.getRangeAllFontNames(0, pNode.characters.length);
        await Promise.all(fonts.map(f => figma.loadFontAsync(f)));
      } else {
        await figma.loadFontAsync(pNode.fontName);
      }

      pNode.characters = String(pageNum);
      result.updated++;
    } catch (err) {
      result.errors.push({
        slideName: slide.name,
        pageNumber: pageNum,
        message: err.message || 'Unknown error',
      });
    }
  }

  if (notifyHandle) notifyHandle.cancel();
  return result;
}

// ---------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {

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
      const section = figma.currentPage.findOne(n => n.id === config.sectionId);

      if (!section || section.type !== 'SECTION') {
        figma.ui.postMessage({
          type: 'numbering-complete',
          result: { totalSlides: 0, updated: 0, skipped: 0, errors: [{ slideName: '—', pageNumber: 0, message: 'Section not found.' }] },
        });
        break;
      }

      const slides = detectSlides(section, config);

      if (slides.length === 0) {
        // Collect unique sizes of frame-like children to help diagnose filter mismatch
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

    default:
      console.warn('Unhandled message type:', msg.type);
  }
};
