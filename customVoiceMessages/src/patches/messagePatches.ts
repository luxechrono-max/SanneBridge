import { before } from "@vendetta/patcher";
import { FluxDispatcher } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { generateWaveform } from "../waveform";

function safePatch(event: string, callback: (args: any[]) => void) {
    try {
        const handlers =
            FluxDispatcher?._actionHandlers?._computeOrderedActionHandlers?.(event);

        const handler = handlers?.find(
            (i: any) => i.name === "MessageStore"
        );

        if (!handler) return () => {};

        return before("actionHandler", handler, callback);
    } catch {
        return () => {};
    }
}

export function msgSuccess() {
    return safePatch("LOAD_MESSAGES_SUCCESS", (args) => {
        if (!storage.allAsVM) return;

        args?.[0]?.messages?.forEach((x: any) => {
            if (x.flags == 8192) return;

            x.attachments?.forEach((a: any) => {
                if (a?.content_type?.startsWith?.("audio")) {
                    x.flags |= 8192;
                    a.waveform = generateWaveform();
                    a.duration_secs = 60;
                }
            });
        });
    });
}

export function msgCreate() {
    return safePatch("MESSAGE_CREATE", (args) => {
        const message = args?.[0]?.message;

        if (!storage.allAsVM || message?.flags == 8192) return;

        if (message?.attachments?.[0]?.content_type?.startsWith("audio")) {
            message.flags |= 8192;

            message.attachments.forEach((x: any) => {
                x.waveform = generateWaveform();
                x.duration_secs = 60;
            });
        }
    });
}

export function msgUpdate() {
    return safePatch("MESSAGE_UPDATE", (args) => {
        const message = args?.[0]?.message;

        if (!storage.allAsVM || message?.flags == 8192) return;

        if (message?.attachments?.[0]?.content_type?.startsWith("audio")) {
            message.flags |= 8192;

            message.attachments.forEach((x: any) => {
                x.waveform = generateWaveform();
                x.duration_secs = 60;
            });
        }
    });
}
