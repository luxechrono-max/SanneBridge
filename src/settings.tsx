import { ReactNative } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormDivider, FormIcon, FormRow } = Forms;

const API = "https://sannewalid.aitnobajansen.workers.dev";

export default () => {
    const openSanne = async () => {
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

            if (!clips.length) {
                ReactNative.Alert.alert(
                    "SanneBridge",
                    "No Sanne clips available."
                );
                return;
            }

            ReactNative.Alert.alert(
                "Latest 5 Sanne clips",
                "Choose a clip:",
                clips.map((clip: any) => ({
                    text: `Sanne · ${
                        clip.createdAt
                            ? new Date(
                                clip.createdAt
                            ).toLocaleTimeString()
                            : "Latest"
                    }`,
                    onPress: async () => {
                        try {
                            const audio =
                                await fetch(clip.url);

                            if (!audio.ok) {
                                throw new Error(
                                    `MP3 HTTP ${audio.status}`
                                );
                            }

                            const buffer =
                                await audio.arrayBuffer();

                            const bytes =
                                new Uint8Array(buffer);

                            let binary = "";

                            for (
                                let i = 0;
                                i < bytes.length;
                                i += 32768
                            ) {
                                binary +=
                                    String.fromCharCode(
                                        ...bytes.subarray(
                                            i,
                                            Math.min(
                                                i + 32768,
                                                bytes.length
                                            )
                                        )
                                    );
                            }

                            const base64 = btoa(binary);

                            const fileManager =
                                findByProps(
                                    "writeFile",
                                    "getConstants"
                                );

                            if (
                                !fileManager?.writeFile
                            ) {
                                throw new Error(
                                    "Kettu FileManager not found"
                                );
                            }

                            const filename =
                                `sanne-${clip.id}.mp3`;

                            const path =
                                await fileManager.writeFile(
                                    "cache",
                                    filename,
                                    base64,
                                    "base64"
                                );

                            const uploader =
                                findByProps(
                                    "uploadLocalFiles"
                                );

                            if (
                                !uploader?.uploadLocalFiles
                            ) {
                                throw new Error(
                                    "Discord uploadLocalFiles not found"
                                );
                            }

                            await uploader.uploadLocalFiles(
                                {
                                    items: [
                                        {
                                            uri: path,
                                            filename,
                                            mimeType:
                                                "audio/mpeg",
                                            size:
                                                bytes.length,
                                        },
                                    ],
                                    flags: 0,
                                }
                            );
                        } catch (e: any) {
                            ReactNative.Alert.alert(
                                "SanneBridge Error",
                                String(
                                    e?.message || e
                                )
                            );
                        }
                    },
                }))
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
                label="Choose Sanne clip"
                onPress={openSanne}
            />
        </ReactNative.ScrollView>
    );
};
