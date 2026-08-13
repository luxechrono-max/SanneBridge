import { findByProps } from "@vendetta/metro";

const API = "https://sannewalid.aitnobajansen.workers.dev";

async function sendLatestSanne(channelId?: string) {
    const response = await fetch(`${API}/bridge/sanne`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error(`Bridge HTTP ${response.status}`);
    }

    const data = await response.json();

    const clips = Array.isArray(data?.clips)
        ? data.clips.filter((clip: any) => clip?.voice === "Sanne")
        : [];

    if (!clips.length) {
        throw new Error("No Sanne clips found");
    }

    const latest = clips.reduce(
        (a: any, b: any) =>
            new Date(b.createdAt).getTime() >
            new Date(a.createdAt).getTime()
                ? b
                : a
    );

    const audio = await fetch(latest.url);

    if (!audio.ok) {
        throw new Error(`MP3 HTTP ${audio.status}`);
    }

    const bytes = new Uint8Array(await audio.arrayBuffer());

    let binary = "";

    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(
            ...bytes.subarray(
                i,
                Math.min(i + 0x8000, bytes.length)
            )
        );
    }

    const fileManager = findByProps(
        "writeFile",
        "getConstants"
    );

    if (!fileManager?.writeFile) {
        throw new Error("Bunny FileManager not found");
    }

    const filename = `sanne-${latest.id}.mp3`;

    const path = await fileManager.writeFile(
        "cache",
        filename,
        btoa(binary),
        "base64"
    );

    const uploader = findByProps("uploadLocalFiles");

    if (!uploader?.uploadLocalFiles) {
        throw new Error("Discord uploader not found");
    }

    await uploader.uploadLocalFiles({
        channelId,
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
}

export const onLoad = () => {
    (globalThis as any).__SanneSend = sendLatestSanne;
};

export const onUnload = () => {
    delete (globalThis as any).__SanneSend;
};

export { default as settings } from "./settings";
