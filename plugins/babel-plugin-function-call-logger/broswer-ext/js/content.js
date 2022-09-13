const MARK = "__call__trace__";
const GLOBAL_CONFIG_MARK = MARK + "config__";

const injectScript = (path, id) => {
  console.log("start inject");
  if (id) {
    const script = document.getElementById(id);
    if (script) {
      script.src = path;
    } else {
      const newScript = document.createElement("script");
      newScript.id = id;
      newScript.src = chrome.runtime.getURL(path);
      document.head.appendChild(newScript);
    }
  } else {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(path);
    document.head.appendChild(script);
  }
};
/**
 * inject pre-inject.js to parse dynamic script's parames
 */
setTimeout(() => {
  injectScript("/js/pre-inject.js");
}, 100);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "getConfig": {
      const config = (() => {
        try {
          return JSON.parse(localStorage.getItem(GLOBAL_CONFIG_MARK));
        } catch (error) {
          return {};
        }
      })();
      sendResponse(config);
      break;
    }
    case "setConfig": {
      const newConfig = request.payload;
      localStorage.setItem(GLOBAL_CONFIG_MARK, JSON.stringify(newConfig));
      sendResponse({});
      break;
    }
    default: break
  }
});
