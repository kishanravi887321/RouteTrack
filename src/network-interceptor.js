(function () {
  // Inject interceptor into page context using external script
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/injected-script.js");
  script.onload = function() {
    this.remove();
  };
  
  const parent = document.documentElement || document.head || document.body;
  if (parent) {
    parent.appendChild(script);
  }

  // Listen for messages from injected script
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "ROUTE_TRACKER_REQUEST") {
      chrome.runtime.sendMessage({
        type: "CAPTURE_REQUEST",
        url: event.data.url,
        method: event.data.method
      }).catch(() => {
        // Silently fail if runtime is not available
      });
    }
  });
})();
