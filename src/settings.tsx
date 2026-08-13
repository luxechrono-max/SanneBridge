import { ReactNative } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import SannePage from "./sannePage";

const { FormDivider, FormIcon, FormRow } = Forms;

export default () => {
    const navigation = findByProps("push", "pop");

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
