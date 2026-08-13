import { ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormDivider, FormIcon } = Forms;

const API = "https://sannewalid.aitnobajansen.workers.dev";

export default () => {
    const loadSanne = async () => {
        try {
            const response = await fetch(
                `${API}/bridge/sanne`,
                {
                    cache: "no-store",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

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
                "SanneBridge",
                clips
                    .map(
                        (clip: any, index: number) =>
                            `${index + 1}. Sanne · ${
                                clip.createdAt
                                    ? new Date(
                                        clip.createdAt
                                    ).toLocaleTimeString()
                                    : "Latest"
                            }`
                    )
                    .join("\n")
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
            <ReactNative.View
                style={{
                    padding: 16,
                }}
            >
                <ReactNative.View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <FormIcon
                        source={getAssetIDByName(
                            "voice_bar_mute_off"
                        )}
                    />

                    <ReactNative.Text
                        style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "800",
                            marginLeft: 12,
                        }}
                    >
                        SanneBridge
                    </ReactNative.Text>
                </ReactNative.View>

                <FormDivider />

                <ReactNative.TouchableOpacity
                    onPress={loadSanne}
                    style={{
                        marginTop: 16,
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: "#5865f2",
                    }}
                >
                    <ReactNative.Text
                        style={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "700",
                        }}
                    >
                        LOAD LATEST SANNE CLIPS
                    </ReactNative.Text>
                </ReactNative.TouchableOpacity>
            </ReactNative.View>
        </ReactNative.ScrollView>
    );
};
