document.addEventListener('DOMContentLoaded', () => {
  const screenshotBtn = document.getElementById('screenshot-btn');
  const statusMsg = document.getElementById('status-msg');

  screenshotBtn.addEventListener('click', async () => {
    try {
            // Capture the visible tab
            // windowId is explicitly provided to ensure we target the current window
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length === 0) {
              showStatus('No active tab found.', 'error');
              return;
            }
            
            const windowId = tabs[0].windowId;
            const dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
            
            if (!dataUrl) {
              throw new Error('Capture failed (dataUrl is empty). Check permissions.');
            }
      
            // Convert Data URL to Blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();
      
            // Write to clipboard
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ]);
      
            showStatus('Copied to clipboard! Paste below.', 'success');
          } catch (err) {
            console.error('Screenshot failed:', err);
            // Show specific error message if available
            showStatus(`Error: ${err.message || 'Failed to capture'}`, 'error');
          }  });

  function showStatus(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `status ${type}`;
    statusMsg.style.opacity = '1';

    setTimeout(() => {
      statusMsg.style.opacity = '0';
    }, 3000);
  }
});
