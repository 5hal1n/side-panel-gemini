import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://gemini.google.com/*"],
  all_frames: true
}

// Listen for messages from the extension (side panel)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GEMINI_SIDE_PANEL_FOCUS') {
    focusInput();
  }
});

function focusInput() {
  // Try common selectors for the prompt input area in Gemini
  const selectors = [
    'div[contenteditable="true"]',
    'rich-textarea > div',
    'textarea',
    'input[type="text"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      element.focus();
      return;
    }
  }
}
