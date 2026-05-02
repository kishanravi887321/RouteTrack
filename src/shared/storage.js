export const STORAGE_KEY = "panelHidden";

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
