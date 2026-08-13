import { ReactNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";

const API = "https://sannewalid.aitnobajansen.workers.dev";

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

                            const data =
                                await response.json();

                            const clips =
                                Array.isArray(data?.clips)
                                    ? data.clips.filter(
                                        (clip: any) =>
                                            clip?.voice === "Sanne"
                                    )
                                    : [];

                            if (!clips.length) {
                                ReactNative.Alert.alert(
                                    "SanneBridge",
                                    "No Sanne clips found."
                                );
                                return;
                            }

                            const latest = clips.reduce(
                                (
                                    newest: any,
                                    clip: any
                                ) =>
                                    new Date(
                                        clip.createdAt
                                    ).getTime() >
                                    new Date(
                                        newest.createdAt
                                    ).getTime()
                                        ? clip
                                        : newest
                            );

                            ReactNative.Alert.alert(
                                "Latest Sanne",
                                `Timestamp:\n${latest.createdAt}\n\nClip ID:\n${latest.id}`
                            );
                        } catch (e: any) {
                            ReactNative.Alert.alert(
                                "SanneBridge Error",
                                String(e?.message || e)
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
                        FETCH LATEST SANNE
                    </ReactNative.Text>
                </ReactNative.TouchableOpacity>
            </ReactNative.View>
        </ReactNative.ScrollView>
    );
};
