import voiceMessages from "./patches/voiceMessages";
import { msgCreate, msgSuccess, msgUpdate } from "./patches/messagePatches";
import download from "./patches/download";
import { storage } from "@vendetta/plugin";

storage.sendAsVM ??= true;
storage.allAsVM ??= false;

let patches: (() => void)[] = [];

export const onLoad = () => {
    patches = [
        voiceMessages(),
        msgCreate(),
        msgSuccess(),
        msgUpdate(),
        download()
    ];
};

export const onUnload = () => {
    patches.forEach(p => p());
    patches = [];
};

export { default as settings } from "./settings";
