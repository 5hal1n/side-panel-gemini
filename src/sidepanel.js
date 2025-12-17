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

      // Attempt to focus the input area in the Gemini iframe
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'GEMINI_SIDE_PANEL_FOCUS' }, '*');
      }

    } catch (err) {
      console.error('Screenshot failed:', err);
      // Show specific error message if available
      showStatus(`Error: ${err.message || 'Failed to capture'}`, 'error');
    }
  });

  function showStatus(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `status ${type}`;
    statusMsg.style.opacity = '1';

    setTimeout(() => {
      statusMsg.style.opacity = '0';
    }, 3000);
  }

  // --- Ad Network Integration (Simulated) ---
  // Note: Manifest V3 strictly prohibits loading remote code (like adsbygoogle.js).
  // To display ads, you must fetch content (JSON/Images) and render it yourself,
  // or use a sandboxed iframe (which has its own limitations).
  // Below is a "Dynamic Ad Fetcher" implementation that simulates connecting to an ad server.

  async function initAdSystem() {
    const adLink = document.getElementById('ad-link');
    const adContent = document.getElementById('ad-content');

    // Configuration: Replace this with your actual Ad Server API endpoint
    // const AD_API_ENDPOINT = 'https://your-ad-server.com/api/v1/banner';

    // Mock Ad Inventory (Simulating a response from Google Ads Manager or custom server)
    const mockAds = [
      {
        text: '🚀 Boost your productivity with Gemini Advanced!',
        url: 'https://gemini.google.com/advanced',
        bgColor: '#e8f0fe',
        color: '#1a73e8'
      },
      {
        text: '📦 Check out the source code on GitHub',
        url: 'https://github.com/5hal1n/side-panel-gemini',
        bgColor: '#202124',
        color: '#ffffff'
      },
      {
        text: '☕ Buy me a coffee',
        url: 'https://example.com/donate',
        bgColor: '#fce8e6',
        color: '#d93025'
      }
    ];

    try {
      // Simulation: Select a random ad (in production, fetch(AD_API_ENDPOINT)...)
      const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];

      // Apply Ad Content
      // If you have image banners, you would create an <img> tag here.
      adContent.innerHTML = `<span>${randomAd.text}</span>`;
      adLink.href = randomAd.url;
      
      // Optional: Style customization based on ad data
      const container = document.getElementById('ad-container');
      container.style.backgroundColor = randomAd.bgColor;
      adContent.style.color = randomAd.color;

      console.log('Ad loaded:', randomAd);

    } catch (err) {
      console.warn('Ad fetch failed, using fallback:', err);
    }
  }

  // Initialize Ads
  initAdSystem();
});
