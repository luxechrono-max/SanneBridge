import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { ReactNative } from "@vendetta/metro/common";

let unpatch: (() => void) | null = null;

export function startChannelMenu() {
    const actionSheet = findByProps(
        "openLazy",
        "hideActionSheet"
    );

    if (!actionSheet?.openLazy) {
        throw new Error("Kettu ActionSheet not found");
    }

    unpatch = after(
        "openLazy",
        actionSheet,
        (args: any[], result: any) => {
            const key = args?.[1];

            ReactNative.Alert.alert(
                "SanneBridge",
                `ActionSheet opened:\n${String(key)}`
            );

            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
