(function(exports,metro,common){'use strict';const onLoad = () => {
  try {
    const fm = metro.findByProps("writeFile", "getConstants");
    if (!fm) {
      common.showToast("SanneBridge: FileManager not found");
      return;
    }
    common.showToast("SanneBridge loaded successfully");
    console.log("[SanneBridge] FileManager OK");
  } catch (e) {
    console.error("[SanneBridge]", e);
    common.showToast(`SanneBridge error: ${String(e?.message || e)}`);
  }
};
const onUnload = () => {
  console.log("[SanneBridge] unloaded");
};exports.onLoad=onLoad;exports.onUnload=onUnload;return exports;})({},vendetta.metro,vendetta.metro.common);