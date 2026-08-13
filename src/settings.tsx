import { ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const {
    FormDivider,
    FormIcon,
    FormRow,
} = Forms;

export default () => {
    const chooseClip = async () => {
        try {
            const bridge = (globalThis as any).__SanneBridge;

            if (!bridge) {
                throw new Error(
                    "SanneBridge is not running"
                );
            }

            const clips =
                await bridge.getSanneClips();

            if (!clips.length) {
                ReactNative.Alert.alert(
                    "SanneBridge",
                    "No Sanne clips available."
                );
                return;
            }

            ReactNative.Alert.alert(
                "Latest 5 Sanne clips",
                "Choose a Sanne clip",
                clips.map((clip: any) => ({
                    text:
                        `Sanne · ${
                            clip.createdAt
                                ? new Date(
                                    clip.createdAt
                                ).toLocaleTimeString()
                                : "Latest"
                        }${
                            typeof clip.duration ===
                            "number"
                                ? ` · ${Math.round(
                                    clip.duration
                                )}s`
                                : ""
                        }`,
                    onPress: async () => {
                        try {
                            await bridge.sendSanne(
                                clip
                            );
                        } catch (e: any) {
                            ReactNative.Alert.alert(
                                "SanneBridge Error",
                                String(
                                    e?.message || e
                                )
                            );
                        }
                    },
                }))
            );
        } catch (e: any) {
            ReactNative.Alert.alert(
                "SanneBridge Error",
                String(e?.message || e)
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
                onPress={chooseClip}
            />
        </ReactNative.ScrollView>
    );
};
