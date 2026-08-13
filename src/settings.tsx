import { React, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormDivider, FormIcon, FormRow } = Forms;

const API = "https://sannewalid.aitnobajansen.workers.dev";

export default () => {
    const [status, setStatus] = React.useState("Loading…");

    React.useEffect(() => {
        fetch(`${API}/bridge/sanne`, {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(
                        `Bridge HTTP ${response.status}`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data?.clips)) {
                    throw new Error(
                        "Invalid bridge response"
                    );
                }

                const clips = data.clips
                    .filter(
                        (clip: any) =>
                            clip?.voice === "Sanne"
                    )
                    .slice(0, 5);

                setStatus(
                    `${clips.length} Sanne clip${
                        clips.length === 1
                            ? ""
                            : "s"
                    } available`
                );
            })
            .catch((error) => {
                setStatus(
                    `Error: ${String(
                        error?.message || error
                    )}`
                );
            });
    }, []);

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
                label="Latest 5 Sanne clips"
                trailing={status}
            />
        </ReactNative.ScrollView>
    );
};
