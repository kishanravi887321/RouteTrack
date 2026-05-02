const overlayModuleUrl = chrome.runtime.getURL("src/overlay/index.js");

import(overlayModuleUrl).catch((error) => {
  console.error("RouteTracker overlay failed to load", error);
});
