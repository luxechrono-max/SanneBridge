import { ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormDivider, FormIcon, FormRow } = Forms;

const API = "https://sannewalid.aitnobajansen.workers.dev";

export default () => {
    const chooseSanne = () => {
        fetch(`${API}/bridge/sanne`, {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(
                        `Bridge HTTP ${response.status}`
                    );
                }

                const data = await response.json();

                const clips = Array.isArray(data?.clips)
                    ? data.clips
                        .filter(
                            (clip: any) =>
                                clip?.voice === "Sanne"
                        )
                        .slice(0, 5)
                    : [];

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
                        text: `Sanne · ${
                            clip.createdAt
                                ? new Date(
                                    clip.createdAt
                                ).toLocaleTimeString()
                                : "Latest"
                        }`,
                        onPress: () => {
                            ReactNative.Alert.alert(
                                "SanneBridge",
                                `Selected Sanne clip ${clip.id}`
                            );
                        },
                    }))
                );
            })
            .catch((error) => {
                ReactNative.Alert.alert(
                    "SanneBridge Error",
                    String(error?.message || error)
                );
            });
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
                onPress={chooseSanne}
            />
        </ReactNative.ScrollView>
    );
};
