import { ContextMenu } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";

const API = "https://sannewalid.aitnobajansen.workers.dev";

let patches: (() => void)[] = [];

async function sendLatestSanne(channelId: string) {
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

    const base64 = btoa(binary);

    const files = findByProps(
        "writeFile",
        "getConstants"
    );

    if (!files?.writeFile) {
        throw new Error("Kettu FileManager unavailable");
    }

    const filename = `sanne-${latest.id}.mp3`;

    const uri = await files.writeFile(
        "cache",
        filename,
        base64,
        "base64"
    );

    const uploader = findByProps(
        "uploadLocalFiles"
    );

    if (!uploader?.uploadLocalFiles) {
        throw new Error(
            "Discord uploader unavailable"
        );
    }

    await uploader.uploadLocalFiles({
        channelId,
        items: [
            {
                uri,
                filename,
                mimeType: "audio/mpeg",
                size: bytes.length,
            },
        ],
        flags: 0,
    });
}

export const onLoad = () => {
    const unpatch = ContextMenu.patch(
        "channel-context",
        (ret: any, props: any) => {
            if (!ret || !props?.channel) {
                return ret;
            }

            const item = ContextMenu.buildItem({
                label: "Send Latest Sanne",
                action: async () => {
                    try {
                        await sendLatestSanne(
                            props.channel.id
                        );
                    } catch (e: any) {
                        console.error(
                            "[SanneBridge]",
                            e
                        );
                    }
                },
            });

            ret.props.children.push(item);

            return ret;
        }
    );

    patches.push(unpatch);
};

export const onUnload = () => {
    patches.forEach((unpatch) => {
        try {
            unpatch();
        } catch {}
    });

    patches = [];
};

export { default as settings } from "./settings";
