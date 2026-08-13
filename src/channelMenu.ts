import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let unpatch: (() => void) | null = null;

export function startChannelMenu() {
    const composer = findByProps(
        "openAttachmentPicker",
        "toggleAttachmentPicker"
    );

    if (!composer) {
        throw new Error("Discord composer module not found");
    }

    const method =
        composer.openAttachmentPicker
            ? "openAttachmentPicker"
            : "toggleAttachmentPicker";

    unpatch = after(
        method,
        composer,
        (args: any[], result: any) => {
            console.log(
                "[SanneBridge] ATTACHMENT PICKER",
                args
            );

            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
