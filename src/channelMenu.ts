import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let unpatch: (() => void) | null = null;

export function startChannelMenu() {
    const actionSheet = findByProps(
        "openLazy",
        "hideActionSheet"
    );

    if (!actionSheet?.openLazy) {
        throw new Error("ActionSheet module not found");
    }

    unpatch = after(
        "openLazy",
        actionSheet,
        (args: any[], result: any) => {
            const lazyImport = args?.[0];
            const key = String(args?.[1] ?? "");
            const props = args?.[2] ?? {};

            if (
                !lazyImport ||
                !/attachment|upload|file/i.test(key)
            ) {
                return result;
            }

            const React = findByProps("createElement");
            const RN = findByProps(
                "View",
                "Text",
                "Pressable"
            );

            const send =
                (globalThis as any).__SanneSend;

            if (!React || !RN || !send) {
                return result;
            }

            args[0] = Promise.resolve({
                default: (sheetProps: any) => {
                    const Original = lazyImport;

                    const channelId =
                        props.channelId ??
                        props.channel?.id ??
                        sheetProps?.channelId ??
                        sheetProps?.channel?.id;

                    return React.createElement(
                        RN.View,
                        null,

                        React.createElement(
                            Original.default ?? Original,
                            sheetProps
                        ),

                        React.createElement(
                            RN.Pressable,
                            {
                                onPress: () => {
                                    if (channelId) {
                                        send(channelId);
                                    }
                                },
                                style: {
                                    padding: 16,
                                },
                            },
                            React.createElement(
                                RN.Text,
                                {
                                    style: {
                                        fontSize: 16,
                                        fontWeight: "700",
                                    },
                                },
                                "Send Latest Sanne"
                            )
                        )
                    );
                },
            });

            return result;
        }
    );

    return () => {
        unpatch?.();
        unpatch = null;
    };
}
