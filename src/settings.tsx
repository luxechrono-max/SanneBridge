import { ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormDivider, FormIcon, FormRow } = Forms;

export default () => {
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

            <ReactNative.TouchableOpacity
                onPress={() =>
                    ReactNative.Alert.alert(
                        "SanneBridge",
                        "Button callback works."
                    )
                }
                style={{
                    margin: 12,
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
                    TEST SANNE BUTTON
                </ReactNative.Text>
            </ReactNative.TouchableOpacity>
        </ReactNative.ScrollView>
    );
};
