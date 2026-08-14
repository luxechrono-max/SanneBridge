(function(exports,plugin){'use strict';var _a, _b;
(_a = plugin.storage).sendAsVM ?? (_a.sendAsVM = true);
(_b = plugin.storage).allAsVM ?? (_b.allAsVM = false);
const onLoad = () => {
  console.log("[CustomVoiceMessages+] LOADED");
};
const onUnload = () => {
  console.log("[CustomVoiceMessages+] UNLOADED");
};exports.onLoad=onLoad;exports.onUnload=onUnload;return exports;})({},vendetta.plugin);