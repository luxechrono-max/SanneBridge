import { findByProps } from "@vendetta/metro";

const API = "https://sannewalid.aitnobajansen.workers.dev";

async function sendLatestSanne(channelId: string) {
    const response = await fetch(`${API}/bridge/sanne`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error(`Bridge HTTP ${response.status}`);
    }

    const data = await response.json();

    const clips = Array.isArray(data?.clips)
        ? data.clips.filter(
            (clip: any) => clip?.voice === "Sanne"
        )
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

    const mp3 = await fetch(latest.url);

    if (!mp3.ok) {
        throw new Error(`MP3 HTTP ${mp3.status}`);
    }

    const buffer = await mp3.arrayBuffer();
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

    const files = findByProps(
        "writeFile",
        "getConstants"
    );

    const uploader = findByProps(
        "uploadLocalFiles"
    );

    if (!files?.writeFile) {
        throw new Error("FileManager unavailable");
    }

    if (!uploader?.uploadLocalFiles) {
        throw new Error("Uploader unavailable");
    }

    const filename = `sanne-${latest.id}.mp3`;

    const uri = await files.writeFile(
        "cache",
        filename,
        btoa(binary),
        "base64"
    );

    await uploader.uploadLocalFiles({
        channelId,
        items: [{
            uri,
            filename,
            mimeType: "audio/mpeg",
            size: bytes.length,
        }],
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
