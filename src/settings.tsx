import { ReactNative } from "@vendetta/metro/common";

export default () => {
    const fetchLatest = async () => {
        try {
            const fn = (globalThis as any).__SanneGetLatest;

            if (!fn) {
                throw new Error("Sanne API is not loaded.");
            }

            const clip = await fn();

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
    };

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
                    onPress={fetchLatest}
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
