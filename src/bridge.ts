import { showToast } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";

const API = "https://sannewalid.aitnobajansen.workers.dev";
const MAX_CLIPS = 5;

export async function getSanneClips() {
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

    if (!Array.isArray(data?.clips)) {
        throw new Error("Invalid bridge response");
    }

    return data.clips
        .filter((clip: any) => clip?.voice === "Sanne")
        .slice(0, MAX_CLIPS);
}

export async function sendSanne(clip: any) {
    showToast("Preparing Sanne…");

    const response = await fetch(clip.url);

    if (!response.ok) {
        throw new Error(`MP3 HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let binary = "";
    const chunkSize = 32768;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(
            ...bytes.subarray(
                i,
                Math.min(i + chunkSize, bytes.length)
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
        throw new Error("Discord uploadLocalFiles not found");
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
}
