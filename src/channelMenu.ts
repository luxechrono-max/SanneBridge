import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let unpatch: (() => void) | null = null;

export function startChannelMenu() {
    const menu = findByProps("openContextMenu");

    if (!menu?.openContextMenu) {
        throw new Error("Context menu module not found");
    }

    unpatch = after(
        "openContextMenu",
        menu,
        (_args: any[], result: any) => {
            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
