import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let unpatch: (() => void) | null = null;

export function startChannelMenu() {
    const picker = findByProps(
        "openAttachmentPicker",
        "toggleAttachmentPicker"
    );

    if (!picker) {
        throw new Error("Attachment picker module not found");
    }

    const method = picker.openAttachmentPicker
        ? "openAttachmentPicker"
        : "toggleAttachmentPicker";

    unpatch = after(
        method,
        picker,
        (args: any[], result: any) => {
            const props = args?.[0] ?? {};

            const children =
                result?.props?.children;

            const send =
                (globalThis as any).__SanneSend;

            if (
                send &&
                Array.isArray(children)
            ) {
                children.push({
                    type: "button",
                    label: "Send Latest Sanne",
                    action: () => {
                        const channelId =
                            props.channelId ??
                            props.channel?.id;

                        if (!channelId) return;

                        send(channelId);
                    },
                });
            }

            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
