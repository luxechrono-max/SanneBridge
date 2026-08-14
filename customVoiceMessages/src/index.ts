import voiceMessages from "./patches/voiceMessages";
import {
    msgCreate,
    msgSuccess,
    msgUpdate
} from "./patches/messagePatches";
import { storage } from "@vendetta/plugin";

storage.sendAsVM ??= true;
storage.allAsVM ??= false;

let patches: (() => void)[] = [];

export const onLoad = () => {
    try {
        patches.push(voiceMessages());
    } catch (e) {
        console.log("[CustomVoiceMessages+] voiceMessages failed:", e);
    }

    try {
        patches.push(msgCreate());
        patches.push(msgSuccess());
        patches.push(msgUpdate());
    } catch (e) {
        console.log("[CustomVoiceMessages+] messagePatches failed:", e);
    }
};

export const onUnload = () => {
    patches.forEach((p) => {
        try {
            p?.();
        } catch {}
    });

    patches = [];
};

export { default as settings } from "./settings";
