chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Note: Automatically opening the side panel on window creation (chrome.windows.onCreated)
// is restricted by Chrome as it requires a user gesture.
// The configuration above ensures that clicking the extension icon opens the side panel.
