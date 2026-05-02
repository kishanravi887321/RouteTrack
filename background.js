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
