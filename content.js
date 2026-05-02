const storageKey = "panelHidden";
const panelId = "rt-right-panel";
const hiddenClass = "rt-hidden";

const state = {
  hidden: false,
};

const ui = {
  panel: null,
  toggleButton: null,
  statusText: null,
};

function applyState() {
  if (!ui.panel) {
    return;
  }

  ui.panel.classList.toggle(hiddenClass, state.hidden);
  ui.panel.setAttribute("aria-hidden", String(state.hidden));

  if (ui.toggleButton) {
    ui.toggleButton.textContent = state.hidden ? "Show panel" : "Hide panel";
  }

  if (ui.statusText) {
    ui.statusText.textContent = state.hidden ? "Panel hidden" : "Panel visible";
  }
}

function setHidden(hidden, source) {
  state.hidden = hidden;
  applyState();
  chrome.storage.local.set({ [storageKey]: hidden, lastChangedBy: source });
}

function ensurePanel() {
  let panel = document.getElementById(panelId);
  if (!panel) {
    panel = document.createElement("section");
    panel.id = panelId;
    panel.className = "rt-panel";
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = `
      <div class="rt-panel-inner">
        <div class="rt-header">
          <div>
            <div class="rt-title">RouteTracker</div>
            <div class="rt-subtitle">Right-side transparent overlay</div>
          </div>
          <button class="rt-close" type="button" aria-label="Hide panel" data-rt-close>
            X
          </button>
        </div>
        <button class="rt-button" type="button" data-rt-toggle>Hide panel</button>
        <div class="rt-status" data-rt-status>Panel visible</div>
        <div class="rt-shortcut">Shortcut: Ctrl+Shift+H</div>
        <div class="rt-hint">Pinned to the right edge of every page.</div>
      </div>
    `;
    const parent = document.body || document.documentElement;
    parent.appendChild(panel);
  }

  ui.panel = panel;
  ui.toggleButton = panel.querySelector("[data-rt-toggle]");
  ui.statusText = panel.querySelector("[data-rt-status]");
  const closeButton = panel.querySelector("[data-rt-close]");

  if (ui.toggleButton) {
    ui.toggleButton.addEventListener("click", () => {
      setHidden(!state.hidden, "overlay");
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      setHidden(true, "overlay");
    });
  }
}

function init() {
  ensurePanel();
  chrome.storage.local.get([storageKey], (result) => {
    state.hidden = Boolean(result[storageKey]);
    applyState();
  });
}

init();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes[storageKey]) {
    return;
  }

  state.hidden = Boolean(changes[storageKey].newValue);
  applyState();
});
