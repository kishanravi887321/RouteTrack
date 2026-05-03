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
