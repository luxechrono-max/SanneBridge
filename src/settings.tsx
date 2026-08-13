import { ReactNative } from "@vendetta/metro/common";

export default () => {
    const send = () => {
        const fn = (globalThis as any).__SanneGetLatest;

        ReactNative.Alert.alert(
            "SanneBridge",
            fn
                ? "Sanne API is loaded."
                : "Sanne API is NOT loaded."
        );
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
                    onPress={send}
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
                        TEST SANNE API
                    </ReactNative.Text>
                </ReactNative.TouchableOpacity>
            </ReactNative.View>
        </ReactNative.ScrollView>
    );
};
