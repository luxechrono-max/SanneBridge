import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let stop: (() => void) | null = null;

export function startChannelMenu() {
    const contextMenu = findByProps(
        "openContextMenu",
        "closeContextMenu"
    );

    if (!contextMenu?.openContextMenu) {
        throw new Error("Discord context menu unavailable");
    }

    stop = after(
        "openContextMenu",
        contextMenu,
        (_args: any[], result: any) => {
            console.log(
                "[SanneBridge] context menu opened"
            );

            return result;
        }
    );

    return () => {
        stop?.();
        stop = null;
    };
}
