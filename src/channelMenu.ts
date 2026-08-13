import { findByPropsAll } from "@metro/wrappers";
import { ReactNative } from "@metro/common";

let ran = false;

export function startChannelMenu() {
    if (ran) return () => {};
    ran = true;

    const candidates = [
        "sendMessage",
        "sendMessageWithAttachments",
        "uploadFile",
        "uploadFiles",
        "pickFile",
        "pickFiles",
        "openAttachmentPicker",
        "toggleAttachmentPicker",
    ];

    const results: string[] = [];

    for (const prop of candidates) {
        try {
            const modules = findByPropsAll(prop);

            if (modules?.length) {
                results.push(`${prop}: ${modules.length}`);
            }
        } catch {}
    }

    ReactNative.Alert.alert(
        "SanneBridge",
        results.length
            ? results.join("\n")
            : "No attachment/upload modules found"
    );

    return () => {};
}
