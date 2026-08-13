import { ReactNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";

export default () => {
    return (
        <ReactNative.ScrollView>
            <ReactNative.View style={{ padding: 16 }}>
                <ReactNative.Text
                    style={{
                        color: "white",
                        fontSize: 22,
                        fontWeight: "800",
                        marginBottom: 20,
                    }}
                >
                    SanneBridge
                </ReactNative.Text>

                <ReactNative.TouchableOpacity
                    onPress={async () => {
                        try {
                            const getClips =
                                (globalThis as any)
                                    .__SanneGetClips;

                            if (!getClips) {
                                throw new Error(
                                    "SanneBridge is not running"
                                );
                            }

                            const clips = await getClips();

                            ReactNative.Alert.alert(
                                "Latest Sanne Clips",
                                clips.length
                                    ? clips
                                        .map(
                                            (
                                                clip: any,
                                                i: number
                                            ) =>
                                                `${i + 1}. ${
                                                    clip.id
                                                }`
                                        )
                                        .join("\n")
                                    : "No Sanne clips available."
                            );
                        } catch (e: any) {
                            ReactNative.Alert.alert(
                                "SanneBridge Error",
                                String(
                                    e?.message || e
                                )
                            );
                        }
                    }}
                    style={{
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
                        LOAD SANNE CLIPS
                    </ReactNative.Text>
                </ReactNative.TouchableOpacity>
            </ReactNative.View>
        </ReactNative.ScrollView>
    );
};
