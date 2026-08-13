import { getLatestSanne } from "./sanneApi";

export const onLoad = () => {
    (globalThis as any).__SanneGetLatest = getLatestSanne;
};

export const onUnload = () => {
    delete (globalThis as any).__SanneGetLatest;
};

export { default as settings } from "./settings";
