// Slide Numbering Plugin — code.js
// Main thread: runs in Figma plugin sandbox (ES2020+)

figma.showUI(__html__, { width: 320, height: 500, themeColors: true });

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {

    case 'get-sections':
      // T004: scan current page for SECTION nodes, return SectionInfo[]
      break;

    case 'run-numbering':
      // T010: receive PluginConfig, run detection → sort → number pipeline
      break;

    default:
      console.warn('Unhandled message type:', msg.type);
  }
};
