import { getLatestSanne } from "./sanneApi";

export const onLoad = () => {
    console.log("[SanneBridge] loaded");
};

export const onUnload = () => {
    console.log("[SanneBridge] unloaded");
};

export { default as settings } from "./settings";
