import { findByProps } from "@vendetta/metro";

const API = "https://sannewalid.aitnobajansen.workers.dev";

async function sendLatestSanne() {
    const r = await fetch(`${API}/bridge/sanne`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!r.ok) throw new Error(`Bridge HTTP ${r.status}`);

    const data = await r.json();

    const clips = Array.isArray(data?.clips)
        ? data.clips
            .filter((c: any) => c?.voice === "Sanne")
            .slice(0, 5)
        : [];

    if (!clips.length) throw new Error("No Sanne clips found");

    const clip = clips.reduce(
        (a: any, b: any) =>
            new Date(b.createdAt).getTime() >
            new Date(a.createdAt).getTime()
                ? b
                : a
    );

    const mp3 = await fetch(clip.url);

    if (!mp3.ok) throw new Error(`MP3 HTTP ${mp3.status}`);

    const bytes = new Uint8Array(
        await mp3.arrayBuffer()
    );

    let binary = "";

    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(
            ...bytes.subarray(
                i,
                Math.min(i + 0x8000, bytes.length)
            )
        );
    }

    const fm = findByProps(
        "writeFile",
        "getConstants"
    );

    if (!fm?.writeFile)
        throw new Error("Bunny FileManager not found");

    const filename = `sanne-${clip.id}.mp3`;

    const path = await fm.writeFile(
        "cache",
        filename,
        btoa(binary),
        "base64"
    );

    const uploader = findByProps(
        "uploadLocalFiles"
    );

    if (!uploader?.uploadLocalFiles)
        throw new Error(
            "Discord uploadLocalFiles not found"
        );

    await uploader.uploadLocalFiles({
        items: [{
            uri: path,
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
