import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

const send = () => (globalThis as any).__SanneSend;

export function startChannelMenu() {
    const menu = findByProps("openContextMenu", "closeContextMenu");

    if (!menu?.openContextMenu) {
        throw new Error("Discord context menu module not found");
    }

    return before("openContextMenu", menu, (args: any[]) => {
        const props = args?.[1];

        if (!props?.channel?.id) return args;

        console.log(
            "[SanneBridge] channel:",
            props.channel.id
        );

        return args;
    });
}
