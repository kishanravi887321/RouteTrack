import {
  ensureOverlay,
  HIDDEN_CLASS,
  TAB_HIDDEN_CLASS,
} from "./dom.js";
import {
  getPanelHidden,
  onPanelHiddenChange,
  setPanelHidden,
} from "../shared/storage.js";

const state = {
  hidden: false,
};

let ui = {
  panel: null,
  toggleButton: null,
  statusText: null,
  tabButton: null,
};

function applyState() {
  if (!ui.panel) {
    return;
  }

  ui.panel.classList.toggle(HIDDEN_CLASS, state.hidden);
  ui.panel.setAttribute("aria-hidden", String(state.hidden));

  if (ui.toggleButton) {
    ui.toggleButton.textContent = state.hidden ? "Show panel" : "Hide panel";
    ui.toggleButton.setAttribute("aria-pressed", String(!state.hidden));
  }

  if (ui.statusText) {
    ui.statusText.textContent = state.hidden ? "Panel hidden" : "Panel visible";
  }

  if (ui.tabButton) {
    ui.tabButton.classList.toggle(TAB_HIDDEN_CLASS, !state.hidden);
    ui.tabButton.setAttribute("aria-hidden", String(!state.hidden));
  }
}

function setHidden(hidden, source) {
  state.hidden = hidden;
  applyState();
  setPanelHidden(hidden, source);
}

function init() {
  ui = ensureOverlay({
    onToggle: () => setHidden(!state.hidden, "overlay"),
    onClose: () => setHidden(true, "overlay"),
    onTab: () => setHidden(false, "tab"),
  });

  getPanelHidden().then((hidden) => {
    state.hidden = hidden;
    applyState();
  });

  onPanelHiddenChange((hidden) => {
    state.hidden = hidden;
    applyState();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
