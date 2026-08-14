import { before, after } from "@vendetta/patcher";
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets";
import { findByProps } from "@vendetta/metro";
import { findInReactTree } from "@vendetta/utils";
import { React, ReactNative } from "@vendetta/metro/common";
import CoolRow from "../components/CoolRow";

export default () => {
    const unpatches: (() => void)[] = [];

    try {
        const ActionSheet = findByProps(
            "openLazy",
            "hideActionSheet"
        );

        if (!ActionSheet) return () => {};

        const unpatch = before(
            "openLazy",
            ActionSheet,
            (ctx) => {
                try {
                    const [component, args, actionMessage] = ctx;
                    const message = actionMessage?.message;

                    if (
                        args !== "MessageLongPressActionSheet" ||
                        !message
                    ) {
                        return;
                    }

                    component?.then?.((instance: any) => {
                        try {
                            const unpatchAfter = after(
                                "default",
                                instance,
                                (_: any, component2: any) => {
                                    const buttons = findInReactTree(
                                        component2,
                                        (x: any) =>
                                            x?.[0]?.type?.name === "ButtonRow"
                                    );

                                    if (!buttons) return component2;

                                    if (message.hasFlag?.(8192)) {
                                        buttons.splice(
                                            5,
                                            0,
                                            React.createElement(CoolRow, {
                                                label: "Download Voice Message",
                                                icon: getAssetId(
                                                    "ic_download_24px"
                                                ),
                                                onPress: async () => {
                                                    try {
                                                        await findByProps(
                                                            "downloadMediaAsset"
                                                        )?.downloadMediaAsset(
                                                            message.attachments[0].url,
                                                            0
                                                        );

                                                        findByProps(
                                                            "hideActionSheet"
                                                        )?.hideActionSheet();
                                                    } catch {}
                                                }
                                            })
                                        );

                                        buttons.splice(
                                            6,
                                            0,
                                            React.createElement(CoolRow, {
                                                label: "Copy Voice Message URL",
                                                icon: getAssetId("copy"),
                                                onPress: async () => {
                                                    try {
                                                        const { clipboard } =
                                                            require("@vendetta/metro/common");

                                                        clipboard.setString(
                                                            message.attachments[0].url
                                                        );

                                                        findByProps(
                                                            "hideActionSheet"
                                                        )?.hideActionSheet();
                                                    } catch {}
                                                }
                                            })
                                        );
                                    }

                                    return component2;
                                }
                            );

                            unpatches.push(unpatchAfter);
                        } catch {}
                    });
                } catch {}
            }
        );

        unpatches.push(unpatch);
    } catch {}

    return () => {
        unpatches.forEach((u) => {
            try {
                u?.();
            } catch {}
        });
    };
};
