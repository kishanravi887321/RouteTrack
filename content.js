const storageKey = "panelHidden";
const panelId = "rt-right-panel";
const hiddenClass = "rt-hidden";

function ensurePanel() {
  if (document.getElementById(panelId)) {
    return;
  }

  const panel = document.createElement("div");
  panel.id = panelId;
  panel.className = "rt-panel";
  panel.setAttribute("aria-hidden", "false");
  document.documentElement.appendChild(panel);
}

function setHidden(hidden) {
  const panel = document.getElementById(panelId);
  if (!panel) {
    return;
  }

  panel.classList.toggle(hiddenClass, hidden);
  panel.setAttribute("aria-hidden", String(hidden));
}

function init() {
  ensurePanel();
  chrome.storage.local.get([storageKey], (result) => {
    setHidden(Boolean(result[storageKey]));
  });
}

init();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes[storageKey]) {
    return;
  }

  setHidden(Boolean(changes[storageKey].newValue));
});
