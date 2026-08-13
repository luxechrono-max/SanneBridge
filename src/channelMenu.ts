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
            const a = args?.[0];
            const b = args?.[1];

            const channelId =
                a?.channelId ??
                a?.channel?.id ??
                b?.channelId ??
                b?.channel?.id;

            console.log(
                "[SanneBridge] picker channel:",
                channelId
            );

            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
