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
                        source={getAssetIDByName("voice_bar_mute_off")}
                    />
                }
            />

            <FormDivider />

            <FormRow
                label="Latest 5 Sanne clips"
            />
        </ReactNative.ScrollView>
    );
};
