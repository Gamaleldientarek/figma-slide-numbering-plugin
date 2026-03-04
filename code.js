// Slide Numbering Plugin — code.js
// Main thread: runs in Figma plugin sandbox (ES2020+)

figma.showUI(__html__, { width: 320, height: 500, themeColors: true });

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

    case 'run-numbering':
      // T010: receive PluginConfig, run detection → sort → number pipeline
      break;

    default:
      console.warn('Unhandled message type:', msg.type);
  }
};
