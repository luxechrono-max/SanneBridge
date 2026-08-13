import { ReactNative, NavigationNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormDivider, FormIcon, FormRow } = Forms;

export default () => {
    const navigation = NavigationNative.useNavigation();

    return (
        <ReactNative.ScrollView>
            <FormRow
                label="SanneBridge"
                leading={
                    <FormIcon
                        source={getAssetIDByName("voice_bar_mute_off")}
                    />
                }
            />

            <FormDivider />

            <FormRow
                label="Open SanneBridge"
                onPress={() => {
                    const SannePage =
                        require("./sannePage").default;

                    navigation.push(
                        "VendettaCustomPage",
                        {
                            title: "SanneBridge",
                            render: SannePage,
                        }
                    );
                }}
            />
        </ReactNative.ScrollView>
    );
};
