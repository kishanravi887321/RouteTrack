const overlayModuleUrl = chrome.runtime.getURL("src/overlay/index.js");
const networkInterceptorUrl = chrome.runtime.getURL("src/network-interceptor.js");

import(networkInterceptorUrl).catch((error) => {
  console.error("RouteTracker network interceptor failed to load", error);
});

import(overlayModuleUrl).catch((error) => {
  console.error("RouteTracker overlay failed to load", error);
});
