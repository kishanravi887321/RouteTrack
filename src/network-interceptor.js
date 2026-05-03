import { addCapturedRequest } from "./shared/storage.js";

(function () {
  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const url = args[0];
    const options = args[1] || {};
    const method = options.method || "GET";

    if (typeof url === "string" && url.length > 0) {
      addCapturedRequest(url, method);
    }

    return originalFetch.apply(this, args);
  };

  // Intercept XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (url && typeof url === "string" && url.length > 0) {
      addCapturedRequest(url, method || "GET");
    }
    return originalOpen.apply(this, arguments);
  };
})();
