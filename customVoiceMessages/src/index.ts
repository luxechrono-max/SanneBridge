import voiceMessages from "./patches/voiceMessages";
import { storage } from "@vendetta/plugin";

storage.sendAsVM ??= true;
storage.allAsVM ??= false;

let voicePatch: (() => void) | undefined;

export const onLoad = () => {
    try {
        voicePatch = voiceMessages();
    } catch (e) {
        console.log("[CustomVoiceMessages+] voice patch failed:", e);
    }
};

export const onUnload = () => {
    try {
        voicePatch?.();
    } catch {}
    
    voicePatch = undefined;
};

export { default as settings } from "./settings";
