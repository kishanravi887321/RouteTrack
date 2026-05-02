const storageKey = "panelHidden";

const ui = {
  toggleButton: null,
  statusText: null,
};

const state = {
  hidden: false,
};

function applyState() {
  if (!ui.toggleButton || !ui.statusText) {
    return;
  }

  ui.toggleButton.textContent = state.hidden ? "Show panel" : "Hide panel";
  ui.toggleButton.setAttribute("aria-pressed", String(!state.hidden));
  ui.statusText.textContent = state.hidden ? "Panel hidden" : "Panel visible";
}

function setHidden(hidden, source) {
  state.hidden = hidden;
  applyState();
  chrome.storage.local.set({ [storageKey]: hidden, lastChangedBy: source });
}

document.addEventListener("DOMContentLoaded", () => {
  ui.toggleButton = document.getElementById("toggleButton");
  ui.statusText = document.getElementById("statusText");

  if (!ui.toggleButton || !ui.statusText) {
    return;
  }

  // Sync UI with stored state.
  chrome.storage.local.get([storageKey], (result) => {
    state.hidden = Boolean(result[storageKey]);
    applyState();
  });

  ui.toggleButton.addEventListener("click", () => {
    setHidden(!state.hidden, "popup");
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[storageKey]) {
      return;
    }

    state.hidden = Boolean(changes[storageKey].newValue);
    applyState();
  });
});
