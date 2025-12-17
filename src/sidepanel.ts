document.addEventListener('DOMContentLoaded', () => {
  const screenshotBtn = document.getElementById('screenshot-btn') as HTMLElement;
  const statusMsg = document.getElementById('status-msg') as HTMLElement;

  screenshotBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab.id) {
        // Capture visible tab
        const dataUrl = await chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {
          format: 'png',
        });

        // Send to content script for clipboard copy
        await chrome.tabs.sendMessage(tab.id, {
          action: 'copyImageToClipboard',
          imageDataUrl: dataUrl,
        });

        showStatus('Screenshot copied to clipboard!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showStatus(`Error: ${err.message || 'Failed to capture'}`, 'error');
    }
  });

  function showStatus(text: string, type: string) {
    statusMsg.textContent = text;
    statusMsg.className = `status ${type}`;
    statusMsg.style.opacity = '1';

    setTimeout(() => {
      statusMsg.style.opacity = '0';
    }, 3000);
  }
});
