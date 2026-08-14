import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { generateWaveform } from "../waveform";

const VOICE_MESSAGE_FLAG = 8192;

function transform(item: any) {
    if (!item?.mimeType?.startsWith("audio")) return;

    item.mimeType = "audio/ogg";
    item.waveform = generateWaveform();

    // Discord voice-message attachment fields
    item.duration_secs = item.duration_secs ?? item.durationSecs ?? 0;
    item.durationSecs = item.duration_secs;
}

function patchUpload(method: string) {
    const unpatches: (() => void)[] = [];

    try {
        const module = findByProps(method);
        if (!module) return () => {};

        const unpatch = before(method, module, (args) => {
            try {
                const upload = args?.[0];

                if (!upload || !storage.sendAsVM) return;

                const item = upload.items?.[0] ?? upload;

                if (!item?.mimeType?.startsWith("audio")) return;

                transform(item);

                // The message itself must be marked as a voice message.
                upload.flags = VOICE_MESSAGE_FLAG;

                // Some Discord upload paths keep flags on the item.
                if (upload.items?.[0]) {
                    upload.items[0].flags = VOICE_MESSAGE_FLAG;
                }
            } catch {}
        });

        unpatches.push(unpatch);
    } catch {}

    return () => {
        unpatches.forEach((u) => {
            try {
                u();
            } catch {}
        });
    };
}

export default () => {
    const unpatches = [
        patchUpload("uploadLocalFiles"),
        patchUpload("CloudUpload")
    ];

    return () => {
        unpatches.forEach((u) => u());
    };
};
