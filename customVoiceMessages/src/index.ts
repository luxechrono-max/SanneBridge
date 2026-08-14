import { storage } from "@vendetta/plugin";

storage.sendAsVM ??= true;
storage.allAsVM ??= false;

export const onLoad = () => {
    console.log("[CustomVoiceMessages+] LOADED");
};

export const onUnload = () => {
    console.log("[CustomVoiceMessages+] UNLOADED");
};
