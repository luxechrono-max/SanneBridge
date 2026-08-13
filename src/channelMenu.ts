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
            const channelId =
                args?.[0]?.channelId ??
                args?.[0]?.channel?.id ??
                args?.[1]?.channelId ??
                args?.[1]?.channel?.id;

            if (!channelId) return result;

            const children = result?.props?.children;

            if (!Array.isArray(children)) return result;

            const send = (globalThis as any).__SanneSend;

            if (!send) return result;

            children.push({
                type: "button",
                label: "Send Latest Sanne",
                action: async () => {
                    try {
                        await send(channelId);
                    } catch (e) {
                        console.error(
                            "[SanneBridge] send failed",
                            e
                        );
                    }
                },
            });

            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
