import { ReactNative } from "@vendetta/metro/common";

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
                            const getLatest =
                                (globalThis as any)
                                    .__SanneGetLatest;

                            if (!getLatest) {
                                throw new Error(
                                    "SanneBridge API unavailable"
                                );
                            }

                            const clip =
                                await getLatest();

                            ReactNative.Alert.alert(
                                "Latest Sanne",
                                `Timestamp:\n${clip.createdAt}\n\nClip ID:\n${clip.id}\n\nURL:\n${clip.url}`
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
