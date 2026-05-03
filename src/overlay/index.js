import {
  ensureOverlay,
  HIDDEN_CLASS,
  TAB_HIDDEN_CLASS,
} from "./dom.js";
import {
  getPanelHidden,
  onPanelHiddenChange,
  setPanelHidden,
  getCapturedRequests,
  clearCapturedRequests,
  onRequestsCaptured,
} from "../shared/storage.js";

const state = {
  hidden: false,
  resolved: false,
};

let ui = {
  panel: null,
  toggleButton: null,
  statusText: null,
  tabButton: null,
  requestsList: null,
  clearButton: null,
};

function applyState() {
  if (!ui.panel) {
    return;
  }

  if (!state.resolved) {
    ui.panel.classList.add(HIDDEN_CLASS);
    ui.panel.setAttribute("aria-hidden", "true");

    if (ui.tabButton) {
      ui.tabButton.classList.add(TAB_HIDDEN_CLASS);
      ui.tabButton.setAttribute("aria-hidden", "true");
    }

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

function renderRequests(requests) {
  if (!ui.requestsList) {
    return;
  }

  if (!requests || requests.length === 0) {
    ui.requestsList.innerHTML = '<div class="rt-no-requests">No requests captured yet</div>';
    return;
  }

  ui.requestsList.innerHTML = requests.map((req) => {
    const urlObj = new URL(req.url, window.location.origin);
    const pathname = urlObj.pathname + urlObj.search;
    return `
      <div class="rt-request-item" title="${req.url}">
        <div class="rt-request-method">${req.method}</div>
        <div class="rt-request-url">${pathname}</div>
        <div class="rt-request-time">${req.timestamp}</div>
      </div>
    `;
  }).join("");
}

function init() {
  ui = ensureOverlay({
    onToggle: () => setHidden(!state.hidden, "overlay"),
    onClose: () => setHidden(true, "overlay"),
    onTab: () => setHidden(false, "tab"),
    onClear: () => {
      clearCapturedRequests();
      renderRequests([]);
    },
  });

  applyState();

  getPanelHidden().then((hidden) => {
    state.hidden = hidden;
    state.resolved = true;
    applyState();
  });

  onPanelHiddenChange((hidden) => {
    state.hidden = hidden;
    state.resolved = true;
    applyState();
  });

  getCapturedRequests().then((requests) => {
    renderRequests(requests);
  });

  onRequestsCaptured((requests) => {
    renderRequests(requests);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
