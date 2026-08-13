import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let unpatch: (() => void) | null = null;

export function startChannelMenu() {
    const MessageInput = findByName("MessageInput");

    if (!MessageInput) {
        throw new Error("MessageInput module not found");
    }

    unpatch = after(
        "render",
        MessageInput,
        (_args: any[], result: any) => {
            console.log("[SanneBridge] MessageInput render");
            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
