import { ReactNative } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";

export default () => {
    const sendLatest = () => {
        const getLatest =
            (globalThis as any).__SanneGetLatest;

        if (!getLatest) {
            ReactNative.Alert.alert(
                "SanneBridge",
                "Sanne API is not loaded."
            );
            return;
        }

        getLatest()
            .then(async (clip: any) => {
                const response = await fetch(clip.url);

                if (!response.ok) {
                    throw new Error(
                        `MP3 HTTP ${response.status}`
                    );
                }

                const buffer =
                    await response.arrayBuffer();

                const bytes =
                    new Uint8Array(buffer);

                let binary = "";

                for (
                    let i = 0;
                    i < bytes.length;
                    i += 32768
                ) {
                    binary += String.fromCharCode(
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

                ReactNative.Alert.alert(
                    "SanneBridge",
                    "Latest Sanne MP3 uploaded."
                );
            })
            .catch((e: any) => {
                ReactNative.Alert.alert(
                    "SanneBridge Error",
                    String(e?.message || e)
                );
            });
    };

    return (
        <ReactNative.ScrollView>
            <ReactNative.View
                style={{ padding: 16 }}
            >
                <ReactNative.Text
                    style={{
                        color: "white",
                        fontSize: 22,
                        fontWeight: "800",
                        marginBottom: 20,
                    }}
                >
                    SanneBridge
                </ReactNative.Text>

                <ReactNative.TouchableOpacity
                    onPress={sendLatest}
                    style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: "#5865f2",
                    }}
                >
                    <ReactNative.Text
                        style={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "700",
                        }}
                    >
                        SEND LATEST SANNE
                    </ReactNative.Text>
                </ReactNative.TouchableOpacity>
            </ReactNative.View>
        </ReactNative.ScrollView>
    );
};
