import { before } from "@vendetta/patcher";
import { FluxDispatcher } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { generateWaveform } from "../waveform";

function safePatch(
    event: string,
    callback: (args: any[]) => void
) {
    try {
        const handlers =
            FluxDispatcher._actionHandlers
                ._computeOrderedActionHandlers(event);

        if (!handlers) {
            return () => {};
        }

        const handler = handlers.find(
            (i: any) => i && i.name === "MessageStore"
        );

        if (!handler) {
            return () => {};
        }

        return before(
            "actionHandler",
            handler,
            callback
        );
    } catch (e) {
        console.log(
            "[CustomVoiceMessages+] Failed to patch " + event,
            e
        );

        return () => {};
    }
}

export function msgSuccess() {
    return safePatch(
        "LOAD_MESSAGES_SUCCESS",
        (args) => {
            if (!storage.allAsVM) {
                return;
            }

            if (!args || !args[0] || !args[0].messages) {
                return;
            }

            args[0].messages.forEach((x: any) => {
                if (!x || x.flags == 8192) {
                    return;
                }

                if (!x.attachments) {
                    return;
                }

                x.attachments.forEach((a: any) => {
                    if (
                        a &&
                        a.content_type &&
                        a.content_type.startsWith("audio")
                    ) {
                        x.flags |= 8192;
                        a.waveform = generateWaveform();
                        a.duration_secs = 60;
                    }
                });
            });
        }
    );
}

export function msgCreate() {
    return safePatch(
        "MESSAGE_CREATE",
        (args) => {
            if (!args || !args[0]) {
                return;
            }

            const message = args[0].message;

            if (!message) {
                return;
            }

            if (!storage.allAsVM || message.flags == 8192) {
                return;
            }

            if (!message.attachments) {
                return;
            }

            if (
                message.attachments[0] &&
                message.attachments[0].content_type &&
                message.attachments[0].content_type.startsWith("audio")
            ) {
                message.flags |= 8192;

                message.attachments.forEach((x: any) => {
                    if (!x) {
                        return;
                    }

                    x.waveform = generateWaveform();
                    x.duration_secs = 60;
                });
            }
        }
    );
}

export function msgUpdate() {
    return safePatch(
        "MESSAGE_UPDATE",
        (args) => {
            if (!args || !args[0]) {
                return;
            }

            const message = args[0].message;

            if (!message) {
                return;
            }

            if (!storage.allAsVM || message.flags == 8192) {
                return;
            }

            if (!message.attachments) {
                return;
            }

            if (
                message.attachments[0] &&
                message.attachments[0].content_type &&
                message.attachments[0].content_type.startsWith("audio")
            ) {
                message.flags |= 8192;

                message.attachments.forEach((x: any) => {
                    if (!x) {
                        return;
                    }

                    x.waveform = generateWaveform();
                    x.duration_secs = 60;
                });
            }
        }
    );
}
