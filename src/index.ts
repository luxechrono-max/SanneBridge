import { React, ReactNative, showToast } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";

const API = "https://sannewalid.aitnobajansen.workers.dev";
const MAX_CLIPS = 5;

async function getClips() {
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

async function downloadClip(clip: any) {
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

    const fileManager = findByProps("writeFile", "getConstants");

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

    return {
        path,
        filename,
        size: bytes.length,
    };
}

async function sendSanne(clip: any) {
    showToast("Preparing Sanne…");

    const local = await downloadClip(clip);

    const uploader = findByProps("uploadLocalFiles");

    if (!uploader?.uploadLocalFiles) {
        throw new Error("Discord uploadLocalFiles not found");
    }

    await uploader.uploadLocalFiles({
        items: [
            {
                uri: local.path,
                filename: local.filename,
                mimeType: "audio/mpeg",
                size: local.size,
            },
        ],
        flags: 0,
    });

    showToast(
        "Sanne voice message sent",
        getAssetIDByName("Check")
    );
}

function SanneSettings() {
    const {
        ScrollView,
        View,
        Text,
        TouchableOpacity,
        ActivityIndicator,
    } = ReactNative;

    const [clips, setClips] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    const refresh = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getClips();
            setClips(result);
        } catch (e: any) {
            setError(String(e?.message || e));
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        refresh();
    }, []);

    return React.createElement(
        ScrollView,
        null,

        React.createElement(
            View,
            {
                style: {
                    padding: 16,
                },
            },

            React.createElement(
                Text,
                {
                    style: {
                        color: "white",
                        fontSize: 22,
                        fontWeight: "800",
                        marginBottom: 4,
                    },
                },
                "SanneBridge"
            ),

            React.createElement(
                Text,
                {
                    style: {
                        color: "#b5bac1",
                        marginBottom: 14,
                    },
                },
                "Latest 5 Sanne clips"
            ),

            React.createElement(
                TouchableOpacity,
                {
                    onPress: refresh,
                    style: {
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#2b2d31",
                        marginBottom: 12,
                    },
                },

                React.createElement(
                    Text,
                    {
                        style: {
                            color: "white",
                            textAlign: "center",
                            fontWeight: "700",
                        },
                    },
                    "REFRESH"
                )
            ),

            loading
                ? React.createElement(ActivityIndicator, null)
                : null,

            error
                ? React.createElement(
                    Text,
                    {
                        style: {
                            color: "#f23f42",
                            margin: 12,
                        },
                    },
                    error
                )
                : null,

            !loading && !error && clips.length === 0
                ? React.createElement(
                    Text,
                    {
                        style: {
                            color: "#b5bac1",
                            margin: 12,
                        },
                    },
                    "No Sanne clips available."
                )
                : null,

            ...clips.map((clip) =>
                React.createElement(
                    View,
                    {
                        key: String(clip.id),
                        style: {
                            marginBottom: 10,
                            padding: 12,
                            borderRadius: 10,
                            backgroundColor: "#15171a",
                        },
                    },

                    React.createElement(
                        Text,
                        {
                            style: {
                                color: "white",
                                fontSize: 15,
                                fontWeight: "700",
                            },
                        },
                        `Sanne · ${new Date(
                            clip.createdAt
                        ).toLocaleTimeString()}`
                    ),

                    React.createElement(
                        Text,
                        {
                            style: {
                                color: "#949ba4",
                                marginTop: 3,
                            },
                        },
                        typeof clip.duration === "number"
                            ? `${Math.round(clip.duration)}s`
                            : "MP3"
                    ),

                    React.createElement(
                        TouchableOpacity,
                        {
                            onPress: async () => {
                                try {
                                    await sendSanne(clip);
                                } catch (e: any) {
                                    console.error(
                                        "[SanneBridge]",
                                        e
                                    );

                                    showToast(
                                        String(e?.message || e),
                                        getAssetIDByName("Small")
                                    );
                                }
                            },

                            style: {
                                marginTop: 10,
                                paddingVertical: 11,
                                borderRadius: 8,
                                backgroundColor: "#5865f2",
                            },
                        },

                        React.createElement(
                            Text,
                            {
                                style: {
                                    color: "white",
                                    textAlign: "center",
                                    fontWeight: "700",
                                },
                            },
                            "SEND TO DISCORD"
                        )
                    )
                )
            )
        )
    );
}

export const onLoad = () => {
    console.log("[SanneBridge] loaded");
};

export const onUnload = () => {
    console.log("[SanneBridge] unloaded");
};

// export const settings = SanneSettings;
