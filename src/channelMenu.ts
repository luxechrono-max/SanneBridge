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
        (_args: any[], result: any) => {
            console.log("[SanneBridge] attachment picker opened");
            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
