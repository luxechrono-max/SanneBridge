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
            try {
                const children =
                    result?.props?.children;

                if (Array.isArray(children)) {
                    children.push({
                        type: "button",
                        label: "Send Latest Sanne",
                        action: () => {
                            console.log(
                                "[SanneBridge] Send Latest Sanne"
                            );
                        },
                    });
                }
            } catch (e) {
                console.log(
                    "[SanneBridge] menu patch error",
                    e
                );
            }

            return result;
        }
    );

    return () => {
        stop?.();
        stop = null;
    };
}
