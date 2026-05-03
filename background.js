const storageKey = "panelHidden";

chrome.commands.onCommand.addListener((command) => {
  if (command !== "toggle-panel") {
    return;
  }

  // Toggle stored state so the popup can reflect the change.
  chrome.storage.local.get([storageKey], (result) => {
    const current = Boolean(result[storageKey]);
    chrome.storage.local.set({ [storageKey]: !current, lastChangedBy: "command" });
  });
});

// Listen for network requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CAPTURE_REQUEST") {
    const requestsKey = "capturedRequests";
    chrome.storage.local.get([requestsKey], (result) => {
      const requests = result[requestsKey] || [];
      const newRequest = {
        url: request.url,
        method: request.method,
        timestamp: new Date().toLocaleTimeString(),
      };
      const updated = [newRequest, ...requests].slice(0, 50);
      chrome.storage.local.set({ [requestsKey]: updated });
    });
    sendResponse({ success: true });
  }
  return true;
});
