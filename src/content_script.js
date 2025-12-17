// Listen for postMessages from the parent (side panel)
window.addEventListener('message', (event) => {
  // Verify the message structure
  if (event.data && event.data.type === 'GEMINI_SIDE_PANEL_FOCUS') {
    focusInput();
  }
});

function focusInput() {
  // Try common selectors for the prompt input area in Gemini
  const selectors = [
    'div[contenteditable="true"]',
    'rich-textarea > div',
    'textarea',
    'input[type="text"]'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      // console.log('Gemini Side Panel: Focused input element:', selector);
      return;
    }
  }
  // console.log('Gemini Side Panel: Could not find input element to focus.');
}