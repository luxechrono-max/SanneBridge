import { ReactNative, showToast } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormDivider, FormIcon, FormRow } = Forms;

const API = "https://sannewalid.aitnobajansen.workers.dev";

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
                label="Fetch latest Sanne clips"
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

                        const data = await response.json();

                        const clips = Array.isArray(data?.clips)
                            ? data.clips
                                .filter(
                                    (clip: any) =>
                                        clip?.voice === "Sanne"
                                )
                                .slice(0, 5)
                            : [];

                        showToast(
                            `${clips.length} Sanne clips found`,
                            getAssetIDByName("Check")
                        );
                    } catch (e: any) {
                        showToast(
                            String(e?.message || e),
                            getAssetIDByName("Small")
                        );
                    }
                }}
            />
        </ReactNative.ScrollView>
    );
};
