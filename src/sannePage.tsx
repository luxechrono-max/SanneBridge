import {
    React,
    ReactNative,
    showToast,
} from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import {
    getSanneClips,
    sendSanne,
} from "./bridge";

export default () => {
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
    const [sending, setSending] =
        React.useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getSanneClips();
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
            { style: { padding: 16 } },

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
                    disabled: loading,
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
                    loading ? "LOADING…" : "REFRESH"
                )
            ),

            loading
                ? React.createElement(
                    ActivityIndicator,
                    null
                )
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
                        `Sanne · ${
                            clip.createdAt
                                ? new Date(
                                    clip.createdAt
                                ).toLocaleTimeString()
                                : "Latest"
                        }`
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
                            ? `${Math.round(
                                clip.duration
                            )}s`
                            : "MP3"
                    ),

                    React.createElement(
                        TouchableOpacity,
                        {
                            disabled:
                                sending ===
                                String(clip.id),

                            onPress: async () => {
                                const id =
                                    String(clip.id);

                                try {
                                    setSending(id);
                                    await sendSanne(clip);
                                } catch (e: any) {
                                    console.error(
                                        "[SanneBridge]",
                                        e
                                    );

                                    showToast(
                                        String(
                                            e?.message || e
                                        ),
                                        getAssetIDByName(
                                            "Small"
                                        )
                                    );
                                } finally {
                                    setSending(null);
                                }
                            },

                            style: {
                                marginTop: 10,
                                paddingVertical: 11,
                                borderRadius: 8,
                                backgroundColor:
                                    "#5865f2",
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
                            sending ===
                            String(clip.id)
                                ? "SENDING…"
                                : "SEND TO DISCORD"
                        )
                    )
                )
            )
        )
    );
};
