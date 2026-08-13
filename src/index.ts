import { findByProps } from "@vendetta/metro";

const API = "https://sannewalid.aitnobajansen.workers.dev";

export const onLoad = async () => {
    try {
        const response = await fetch(`${API}/bridge/sanne`, {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Bridge HTTP ${response.status}`);
        }

        const data = await response.json();

        const clip = data?.clips
            ?.filter((x: any) => x?.voice === "Sanne")
            ?.slice(0, 1)?.[0];

        if (!clip?.url) {
            throw new Error("No Sanne clip available");
        }

        const audio = await fetch(clip.url);

        if (!audio.ok) {
            throw new Error(`MP3 HTTP ${audio.status}`);
        }

        const buffer = await audio.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        let binary = "";

        for (let i = 0; i < bytes.length; i += 32768) {
            binary += String.fromCharCode(
                ...bytes.subarray(
                    i,
                    Math.min(i + 32768, bytes.length)
                )
            );
        }

        const base64 = btoa(binary);

        const fileManager = findByProps(
            "writeFile",
            "getConstants"
        );

        if (!fileManager?.writeFile) {
            throw new Error("Kettu FileManager not found");
        }

        const filename = `sanne-${clip.id}.mp3`;

        const path = await fileManager.writeFile(
            "cache",
            filename,
            base64,
            "base64"
        );

        const uploader = findByProps("uploadLocalFiles");

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

        console.log("[SanneBridge] test upload complete");
    } catch (e) {
        console.error("[SanneBridge] test failed", e);
    }
};

export const onUnload = () => {};

export { default as settings } from "./settings";
