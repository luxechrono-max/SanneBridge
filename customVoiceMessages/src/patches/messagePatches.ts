import { before } from "@vendetta/patcher";
import { FluxDispatcher } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { generateWaveform } from "../waveform";

const VOICE_MESSAGE_FLAG = 8192;

function patchMessageEvent(
    event: string,
    callback: (message: any) => void
) {
    try {
        const handlers =
            FluxDispatcher?._actionHandlers?
                ._computeOrderedActionHandlers?.(event);

        const handler = handlers?.find(
            (x: any) => x?.name === "MessageStore"
        );

        if (!handler) return () => {};

        return before(
            "actionHandler",
            handler,
            (args) => {
                try {
                    const message = args?.[0]?.message;

                    if (!message) return;

                    callback(message);
                } catch {}
            }
        );
    } catch {
        return () => {};
    }
}

function transformMessage(message: any) {
    if (!message?.attachments?.length) return;

    const audio = message.attachments.some(
        (a: any) =>
            a?.content_type?.startsWith?.("audio") ||
            a?.contentType?.startsWith?.("audio")
    );

    if (!audio) return;

    // This is the important part:
    // mark the ACTUAL Discord message as a voice message.
    message.flags =
        (message.flags ?? 0) | VOICE_MESSAGE_FLAG;

    message.attachments.forEach((attachment: any) => {
        const isAudio =
            attachment?.content_type?.startsWith?.("audio") ||
            attachment?.contentType?.startsWith?.("audio");

        if (!isAudio) return;

        attachment.waveform =
            attachment.waveform || generateWaveform();

        // Discord message attachment field
        attachment.duration_secs =
            attachment.duration_secs ??
            attachment.durationSecs ??
            0;
    });
}

export function msgCreate() {
    return patchMessageEvent(
        "MESSAGE_CREATE",
        transformMessage
    );
}

export function msgUpdate() {
    return patchMessageEvent(
        "MESSAGE_UPDATE",
        transformMessage
    );
}

export function msgSuccess() {
    try {
        const handlers =
            FluxDispatcher?._actionHandlers?
                ._computeOrderedActionHandlers?.(
                    "LOAD_MESSAGES_SUCCESS"
                );

        const handler = handlers?.find(
            (x: any) => x?.name === "MessageStore"
        );

        if (!handler) return () => {};

        return before(
            "actionHandler",
            handler,
            (args) => {
                try {
                    const messages =
                        args?.[0]?.messages;

                    if (!Array.isArray(messages)) return;

                    messages.forEach(
                        transformMessage
                    );
                } catch {}
            }
        );
    } catch {
        return () => {};
    }
}
