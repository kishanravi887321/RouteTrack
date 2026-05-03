export const STORAGE_KEY = "panelHidden";
export const REQUESTS_KEY = "capturedRequests";

export function getPanelHidden() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(Boolean(result[STORAGE_KEY]));
    });
  });
}

export function setPanelHidden(hidden, source) {
  chrome.storage.local.set({ [STORAGE_KEY]: hidden, lastChangedBy: source });
}

export function onPanelHiddenChange(handler) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[STORAGE_KEY]) {
      return;
    }

    handler(Boolean(changes[STORAGE_KEY].newValue));
  });
}

export function getCapturedRequests() {
  return new Promise((resolve) => {
    chrome.storage.local.get([REQUESTS_KEY], (result) => {
      resolve(result[REQUESTS_KEY] || []);
    });
  });
}

export function addCapturedRequest(url, method = "GET") {
  getCapturedRequests().then((requests) => {
    const newRequest = {
      url,
      method,
      timestamp: new Date().toLocaleTimeString(),
    };
    const updated = [newRequest, ...requests].slice(0, 50); // Keep last 50 requests
    chrome.storage.local.set({ [REQUESTS_KEY]: updated });
  });
}

export function clearCapturedRequests() {
  chrome.storage.local.set({ [REQUESTS_KEY]: [] });
}

export function onRequestsCaptured(handler) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[REQUESTS_KEY]) {
      return;
    }

    handler(changes[REQUESTS_KEY].newValue || []);
  });
}
