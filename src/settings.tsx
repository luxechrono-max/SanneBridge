import { ReactNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { getLatestSanne } from "./sanneApi";

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
                            const clip =
                                await getLatestSanne();

                            ReactNative.Alert.alert(
                                "Latest Sanne",
                                `Timestamp:\n${clip.createdAt}\n\nClip ID:\n${clip.id}`
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
