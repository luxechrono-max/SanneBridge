import {
    ReactNative,
    showToast,
} from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import {
    getSanneClips,
    sendSanne,
} from "./bridge";

const { FormDivider, FormIcon, FormRow } = Forms;

const { showSimpleActionSheet, hideActionSheet } =
    findByProps("showSimpleActionSheet", "hideActionSheet");

export default () => {
    const openSanneClips = async () => {
        try {
            showToast(
                "Loading Sanne clips…",
                getAssetIDByName("voice_bar_mute_off")
            );

            const clips = await getSanneClips();

            if (!clips.length) {
                showToast(
                    "No Sanne clips available",
                    getAssetIDByName("Small")
                );
                return;
            }

            showSimpleActionSheet({
                key: "SanneBridgeClips",
                header: {
                    title: "Latest 5 Sanne clips",
                    onClose: () => hideActionSheet(),
                },
                options: clips.map((clip: any) => ({
                    label: `Sanne · ${
                        clip.createdAt
                            ? new Date(
                                clip.createdAt
                            ).toLocaleTimeString()
                            : "Latest"
                    }${
                        typeof clip.duration === "number"
                            ? ` · ${Math.round(clip.duration)}s`
                            : ""
                    }`,
                    onPress: async () => {
                        hideActionSheet();

                        try {
                            await sendSanne(clip);
                        } catch (e: any) {
                            console.error(
                                "[SanneBridge]",
                                e
                            );

                            showToast(
                                String(
                                    e?.message || e
                                ),
                                getAssetIDByName("Small")
                            );
                        }
                    },
                })),
            });
        } catch (e: any) {
            console.error(
                "[SanneBridge]",
                e
            );

            showToast(
                String(e?.message || e),
                getAssetIDByName("Small")
            );
        }
    };

    return (
        <ReactNative.ScrollView>
            <FormRow
                label="SanneBridge"
                leading={
                    <FormIcon
                        source={getAssetIDByName(
                            "voice_bar_mute_off"
                        )}
                    />
                }
            />

            <FormDivider />

            <FormRow
                label="Choose Sanne clip"
                trailing={FormRow.Arrow}
                onPress={openSanneClips}
            />
        </ReactNative.ScrollView>
    );
};
