(function(exports){'use strict';const onLoad = () => {
  console.log("[SanneBridge] ENABLED");
};
const onUnload = () => {
  console.log("[SanneBridge] DISABLED");
};exports.onLoad=onLoad;exports.onUnload=onUnload;return exports;})({});