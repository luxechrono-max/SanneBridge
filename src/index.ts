import { findByProps } from "@vendetta/metro";
import { showToast } from "@vendetta/metro/common";

export const onLoad = () => {
  try {
    const fm = findByProps("writeFile", "getConstants");

    if (!fm) {
      showToast("SanneBridge: FileManager not found");
      return;
    }

    showToast("SanneBridge loaded successfully");
    console.log("[SanneBridge] FileManager OK");
  } catch (e: any) {
    console.error("[SanneBridge]", e);
    showToast(`SanneBridge error: ${String(e?.message || e)}`);
  }
};

export const onUnload = () => {
  console.log("[SanneBridge] unloaded");
};
