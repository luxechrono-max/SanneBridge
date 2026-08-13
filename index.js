(function(exports,common,metro,plugin){'use strict';const onLoad = () => {
  console.log("[SanneBridge] loaded");
  plugin.storage.sanneBridgeTest = "loaded";
  try {
    const uploader = metro.findByProps("uploadLocalFiles");
    if (uploader?.uploadLocalFiles) {
      console.log("[SanneBridge] uploadLocalFiles found");
    } else {
      console.log("[SanneBridge] uploadLocalFiles NOT found");
    }
  } catch (e) {
    console.error("[SanneBridge]", e);
  }
};
const onUnload = () => {
  console.log("[SanneBridge] unloaded");
};
const settings = () => common.React.createElement(
  "div",
  null,
  "SanneBridge is loaded"
);exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro.common,vendetta.metro,vendetta.plugin);