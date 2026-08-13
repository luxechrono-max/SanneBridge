import { React } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

export const onLoad = () => {
    console.log("[SanneBridge] loaded");

    storage.sanneBridgeTest = "loaded";

    try {
        const uploader = findByProps("uploadLocalFiles");

        if (uploader?.uploadLocalFiles) {
            console.log("[SanneBridge] uploadLocalFiles found");
        } else {
            console.log("[SanneBridge] uploadLocalFiles NOT found");
        }
    } catch (e) {
        console.error("[SanneBridge]", e);
    }
};

export const onUnload = () => {
    console.log("[SanneBridge] unloaded");
};

export const settings = () =>
    React.createElement(
        "div",
        null,
        "SanneBridge is loaded"
    );
