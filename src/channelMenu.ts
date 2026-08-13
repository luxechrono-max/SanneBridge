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
            const send = (globalThis as any).__SanneSend;

            if (!send) return result;

            try {
                const channelId =
                    args?.[0]?.channelId ??
                    args?.[0]?.channel?.id ??
                    args?.[1]?.channelId ??
                    args?.[1]?.channel?.id;

                if (!channelId) return result;

                console.log(
                    "[SanneBridge] picker channel:",
                    channelId
                );
            } catch {}

            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
