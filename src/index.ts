import { showToast } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";

const API = "https://sannewalid.aitnobajansen.workers.dev";

async function sendSanne() {
    try {
        showToast("Loading Sanne…");

        const response = await fetch(`${API}/bridge/sanne`, {
            cache: "no-store",
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Bridge HTTP ${response.status}`);
        }

        const data = await response.json();

        const clips = Array.isArray(data?.clips)
            ? data.clips
                .filter((clip: any) => clip?.voice === "Sanne")
                .slice(0, 5)
            : [];

        if (!clips.length) {
            throw new Error("No Sanne clips available");
        }

        const Actions = findByProps("showSimpleActionSheet");

        if (!Actions?.showSimpleActionSheet) {
            throw new Error("Action sheet not found");
        }

        Actions.showSimpleActionSheet({
            key: "SanneBridge",
            header: {
                title: "Latest 5 Sanne clips",
            },
            options: clips.map((clip: any) => ({
                label: `Sanne · ${
                    clip.createdAt
                        ? new Date(clip.createdAt).toLocaleTimeString()
                        : "Latest"
                }`,
                onPress: async () => {
                    try {
                        showToast("Preparing Sanne…");

                        const audio = await fetch(clip.url);

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

                        if (!fileManager?.writeFile) {
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

                        if (!uploader?.uploadLocalFiles) {
                            throw new Error(
                                "Discord uploadLocalFiles not found"
                            );
                        }

                        await uploader.uploadLocalFiles({
                            items: [
                                {
                                    uri: path,
                                    filename,
                                    mimeType: "audio/mpeg",
                                    size: bytes.length,
                                },
                            ],
                            flags: 0,
                        });

                        showToast(
                            "Sanne voice message sent",
                            getAssetIDByName("Check")
                        );
                    } catch (e: any) {
                        showToast(
                            String(e?.message || e),
                            getAssetIDByName("Small")
                        );
                    }
                },
            })),
        });
    } catch (e: any) {
        showToast(
            String(e?.message || e),
            getAssetIDByName("Small")
        );
    }
}

export const onLoad = () => {
    (globalThis as any).__SanneSend = sendSanne;
};

export const onUnload = () => {
    delete (globalThis as any).__SanneSend;
};

export { default as settings } from "./settings";
