import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://gemini.google.com/*'],
  all_frames: true,
};

// Listen for messages from the extension (side panel)
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'GEMINI_SIDE_PANEL_FOCUS') {
    focusInput();
  } else if (message.type === 'GEMINI_SIDE_PANEL_PASTE_IMAGE') {
    pasteImage(message.dataUrl);
  }
});

function focusInput() {
  // Try common selectors for the prompt input area in Gemini
  const selectors = ['div[contenteditable="true"]', 'rich-textarea > div', 'textarea', 'input[type="text"]'];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      element.focus();
      return;
    }
  }
}

// Function to convert data URL to File object
function dataURLtoFile(dataurl: string, filename: string): File {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr = dataurl.split(',') as any;
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

async function pasteImage(dataUrl: string) {
  const imageFile = dataURLtoFile(dataUrl, 'screenshot.png');

  // Find the contenteditable input area
  const inputArea = document.querySelector('div[contenteditable="true"]');
  if (!inputArea) {
    console.error('Gemini input area not found.');
    return;
  }

  // Find the hidden file input
  const fileInput = document.querySelector('input[type="file"]');
  if (!(fileInput instanceof HTMLInputElement)) {
    console.error('File input not found.');
    return;
  }

  // Create a DataTransfer object and add the file
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(imageFile);
  
  // Assign the files to the file input
  fileInput.files = dataTransfer.files;

  // Dispatch a change event on the file input to trigger the upload
  fileInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

  console.log('Image paste dispatched.');
}