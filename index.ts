import { ReactNative } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/metro/common";

const API = "https://sannewalid.aitnobajansen.workers.dev";
const MAX_CLIPS = 5;

type Clip = {
    id: string;
    voice: "Sanne";
    createdAt: string;
    duration?: number | null;
    filename: string;
    url: string;
};

const { FormRow, FormText, FormIcon, FormDivider } = Forms;

function getFileManager() {
    const fm = findByProps("writeFile", "getConstants");
    if (!fm?.writeFile || !fm?.getConstants) {
        throw new Error("Bunny FileManager not found");
    }
    return fm;
}

function getUploader() {
    const uploader = findByProps("uploadLocalFiles");
    if (!uploader?.uploadLocalFiles) {
        throw new Error("Discord uploadLocalFiles not found");
    }
    return uploader;
}

function formatTime(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

async function getClips(): Promise<Clip[]> {
    const r = await fetch(`${API}/bridge/sanne`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!r.ok) throw new Error(`Bridge HTTP ${r.status}`);

    const data = await r.json();
    if (!Array.isArray(data?.clips)) throw new Error("Invalid bridge response");

    return data.clips
        .filter((c: Clip) => c?.voice === "Sanne")
        .slice(0, MAX_CLIPS);
}

async function downloadClip(clip: Clip) {
    const r = await fetch(clip.url);
    if (!r.ok) throw new Error(`MP3 HTTP ${r.status}`);

    const buffer = await r.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Convert MP3 bytes to base64 for Vendetta's native FileManager.
    let binary = "";
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(
            ...bytes.subarray(i, Math.min(i + chunkSize, bytes.length))
        );
    }

    const base64 = btoa(binary);
    const fm = getFileManager();

    const filename = `sanne-${clip.id}.mp3`;
    const path = await fm.writeFile("cache", filename, base64, "base64");

    return {
        path,
        filename,
        size: bytes.length,
    };
}

async function sendToDiscord(clip: Clip) {
    showToast("Preparing Sanne voice message…");

    const local = await downloadClip(clip);
    const uploader = getUploader();

    const item = {
        uri: local.path,
        filename: local.filename,
        mimeType: "audio/mpeg",
        size: local.size,
    };

    /*
     * customVoiceMessages patches this exact Discord function.
     * It sees audio/* and converts it into a Discord voice-message upload.
     */
    await uploader.uploadLocalFiles({
        items: [{
            ...item,
            item: { ...item },
        }],
        flags: 0,
    });

    showToast("Sanne clip added to Discord", getAssetIDByName("Check"));
}

function ClipRow({ clip }: { clip: Clip }) {
    const { View, Text, TouchableOpacity } = ReactNative;

    const duration =
        typeof clip.duration === "number" && clip.duration > 0
            ? `${Math.round(clip.duration)}s`
            : "MP3";

    return (
        <View style={{
            marginHorizontal: 12,
            marginBottom: 10,
            padding: 12,
            borderRadius: 10,
            backgroundColor: "#15171a",
        }}>
            <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>
                Sanne · {formatTime(clip.createdAt)}
            </Text>

            <Text style={{ color: "#949ba4", marginTop: 3 }}>
                {duration}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                    onPress={() => ReactNative.Linking.openURL(clip.url)}
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        backgroundColor: "#2b2d31",
                        marginRight: 8,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                        Preview
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        try {
                            await sendToDiscord(clip);
                        } catch (e) {
                            console.error("[SanneBridge]", e);
                            showToast(
                                String((e as any)?.message || e),
                                getAssetIDByName("Small")
                            );
                        }
                    }}
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        backgroundColor: "#5865f2",
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                        SEND TO DISCORD
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default () => {
    const { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } = ReactNative;

    const [clips, setClips] = React.useState<Clip[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    const refresh = async () => {
        setLoading(true);
        setError("");

        try {
            setClips(await getClips());
        } catch (e) {
            setError(String((e as any)?.message || e));
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        refresh();
    }, []);

    return (
        <ScrollView>
            <View style={{ padding: 16 }}>
                <Text style={{
                    color: "white",
                    fontSize: 22,
                    fontWeight: "800",
                    marginBottom: 4,
                }}>
                    SanneBridge
                </Text>

                <Text style={{ color: "#b5bac1", marginBottom: 14 }}>
                    Latest 5 Sanne clips
                </Text>

                <TouchableOpacity
                    onPress={refresh}
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#2b2d31",
                        marginBottom: 12,
                    }}
                >
                    <Text style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "700",
                    }}>
                        REFRESH
                    </Text>
                </TouchableOpacity>

                {loading && <ActivityIndicator />}

                {!!error && (
                    <Text style={{ color: "#f23f42", margin: 12 }}>
                        {error}
                    </Text>
                )}

                {!loading && !error && clips.length === 0 && (
                    <Text style={{ color: "#b5bac1", margin: 12 }}>
                        No Sanne clips available.
                    </Text>
                )}

                {clips.map((clip) => (
                    <ClipRow key={clip.id} clip={clip} />
                ))}
            </View>
        </ScrollView>
    );
};
