export const PANEL_ID = "rt-right-panel";
export const TAB_ID = "rt-right-tab";
export const HIDDEN_CLASS = "rt-hidden";
export const TAB_HIDDEN_CLASS = "rt-tab-hidden";

const panelMarkup = `
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
    
    <div class="rt-requests-section">
      <div class="rt-requests-header">
        <h3>Network Requests</h3>
        <button class="rt-clear-btn" type="button" data-rt-clear title="Clear all requests">Clear</button>
      </div>
      <div class="rt-requests-list" data-rt-requests>
        <div class="rt-no-requests">No requests captured yet</div>
      </div>
    </div>
  </div>
`;

const tabMarkup = `
  <svg class="rt-tab-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M1 12c2.5-4 6.5-6 11-6s8.5 2 11 6c-2.5 4-6.5 6-11 6S3.5 16 1 12z" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
`;

export function ensureOverlay(handlers = {}) {
  const safeHandlers = {
    onToggle: handlers.onToggle || null,
    onClose: handlers.onClose || null,
    onTab: handlers.onTab || null,
  };

  let panel = document.getElementById(PANEL_ID);
  if (!panel) {
    panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.className = "rt-panel";
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = panelMarkup;
    const parent = document.body || document.documentElement;
    parent.appendChild(panel);
  }

  const toggleButton = panel.querySelector("[data-rt-toggle]");
  const statusText = panel.querySelector("[data-rt-status]");
  const closeButton = panel.querySelector("[data-rt-close]");
  const requestsList = panel.querySelector("[data-rt-requests]");
  const clearButton = panel.querySelector("[data-rt-clear]");

  if (toggleButton && !toggleButton.dataset.rtBound) {
    toggleButton.addEventListener("click", () => {
      if (safeHandlers.onToggle) {
        safeHandlers.onToggle();
      }
    });
    toggleButton.dataset.rtBound = "true";
  }

  if (closeButton && !closeButton.dataset.rtBound) {
    closeButton.addEventListener("click", () => {
      if (safeHandlers.onClose) {
        safeHandlers.onClose();
      }
    });
    closeButton.dataset.rtBound = "true";
  }

  if (clearButton && !clearButton.dataset.rtBound) {
    clearButton.addEventListener("click", () => {
      if (safeHandlers.onClear) {
        safeHandlers.onClear();
      }
    });
    clearButton.dataset.rtBound = "true";
  }

  let tabButton = document.getElementById(TAB_ID);
  if (!tabButton) {
    tabButton = document.createElement("button");
    tabButton.id = TAB_ID;
    tabButton.className = "rt-tab rt-tab-hidden";
    tabButton.type = "button";
    tabButton.setAttribute("aria-label", "Show panel");
    tabButton.innerHTML = tabMarkup;
    const parent = document.body || document.documentElement;
    parent.appendChild(tabButton);
  }

  if (tabButton && !tabButton.dataset.rtBound) {
    tabButton.addEventListener("click", () => {
      if (safeHandlers.onTab) {
        safeHandlers.onTab();
      }
    });
    tabButton.dataset.rtBound = "true";
  }

  return {
    panel,
    toggleButton,
    statusText,
    tabButton,
  };
}
