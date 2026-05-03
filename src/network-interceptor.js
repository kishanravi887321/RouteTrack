(function () {
  // Inject interceptor into page context
  const script = document.createElement("script");
  script.textContent = `
    (function() {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};
        const method = options.method || "GET";

        if (typeof url === "string" && url.length > 0) {
          window.postMessage({
            type: "ROUTE_TRACKER_REQUEST",
            url: url,
            method: method
          }, "*");
        }

        return originalFetch.apply(this, args);
      };

      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        if (url && typeof url === "string" && url.length > 0) {
          window.postMessage({
            type: "ROUTE_TRACKER_REQUEST",
            url: url,
            method: method || "GET"
          }, "*");
        }
        return originalOpen.apply(this, arguments);
      };
    })();
  `;
  
  const parent = document.documentElement || document.head || document.body;
  if (parent) {
    parent.appendChild(script);
    script.remove();
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
