import { ReactNative } from "@vendetta/metro/common";
import { NavigationNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import SannePage from "./sannePage";

const {
    FormDivider,
    FormIcon,
    FormRow,
} = Forms;

export default () => {
    const navigation = NavigationNative.useNavigation();

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
                label="Open SanneBridge"
                trailing={FormRow.Arrow}
                onPress={() =>
                    navigation.push(
                        "VendettaCustomPage",
                        {
                            title: "SanneBridge",
                            render: SannePage,
                        }
                    )
                }
            />
        </ReactNative.ScrollView>
    );
};
