import {
  getPanelHidden,
  onPanelHiddenChange,
  setPanelHidden,
} from "../shared/storage.js";

const state = {
  hidden: false,
};

const ui = {
  toggleButton: null,
  statusText: null,
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
  setPanelHidden(hidden, source);
}

document.addEventListener("DOMContentLoaded", () => {
  ui.toggleButton = document.getElementById("toggleButton");
  ui.statusText = document.getElementById("statusText");

  if (!ui.toggleButton || !ui.statusText) {
    return;
  }

  getPanelHidden().then((hidden) => {
    state.hidden = hidden;
    applyState();
  });

  ui.toggleButton.addEventListener("click", () => {
    setHidden(!state.hidden, "popup");
  });

  onPanelHiddenChange((hidden) => {
    state.hidden = hidden;
    applyState();
  });
});
