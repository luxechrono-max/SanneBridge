import { ReactNative } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/metro/common";

const API = "https://sannewalid.aitnobajansen.workers.dev";
const MAX_CLIPS = 5;

const { FormRow, FormText, FormIcon, FormDivider } = Forms;

function getFileManager() {
  const fm = findByProps("writeFile", "getConstants");

  if (!fm?.writeFile || !fm?.getConstants) {
    throw new Error("Kettu FileManager not found");
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

function formatTime(value: any) {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) {
    return String(value);
  }

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

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
    const chunk = bytes.subarray(
      i,
      Math.min(i + chunkSize, bytes.length)
    );

    binary += String.fromCharCode(...chunk);
  }

  const base64 = btoa(binary);

  const fileManager = getFileManager();

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

async function sendToDiscord(clip: any) {
  showToast("Preparing Sanne voice message…");

  const localFile = await downloadClip(clip);
  const uploader = getUploader();

  await uploader.uploadLocalFiles({
    items: [
      {
        uri: localFile.path,
        filename: localFile.filename,
        mimeType: "audio/mpeg",
        size: localFile.size,
        item: {
          uri: localFile.path,
          filename: localFile.filename,
          mimeType: "audio/mpeg",
          size: localFile.size,
        },
      },
    ],
    flags: 0,
  });

  showToast(
    "Sanne clip added to Discord",
    getAssetIDByName("Check")
  );
}

function ClipRow({ clip }: { clip: any }) {
  const {
    View,
    Text,
    TouchableOpacity,
  } = ReactNative;

  const duration =
    typeof clip.duration === "number" && clip.duration > 0
      ? `${Math.round(clip.duration)}s`
      : "MP3";

  return React.createElement(
    View,
    {
      style: {
        marginHorizontal: 12,
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
      `Sanne · ${formatTime(clip.createdAt)}`
    ),

    React.createElement(
      Text,
      {
        style: {
          color: "#949ba4",
          marginTop: 3,
        },
      },
      duration
    ),

    React.createElement(
      View,
      {
        style: {
          flexDirection: "row",
          marginTop: 10,
        },
      },

      React.createElement(
        TouchableOpacity,
        {
          onPress: () =>
            ReactNative.Linking.openURL(clip.url),

          style: {
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 8,
            backgroundColor: "#2b2d31",
            marginRight: 8,
          },
        },

        React.createElement(
          Text,
          {
            style: {
              color: "white",
              fontWeight: "700",
            },
          },
          "PREVIEW"
        )
      ),

      React.createElement(
        TouchableOpacity,
        {
          onPress: async () => {
            try {
              await sendToDiscord(clip);
            } catch (error: any) {
              console.error("[SanneBridge]", error);

              showToast(
                String(error?.message || error),
                getAssetIDByName("Small")
              );
            }
          },

          style: {
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 8,
            backgroundColor: "#5865f2",
          },
        },

        React.createElement(
          Text,
          {
            style: {
              color: "white",
              fontWeight: "700",
            },
          },
          "SEND TO DISCORD"
        )
      )
    )
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
    } catch (error: any) {
      setError(String(error?.message || error));
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
        React.createElement(ClipRow, {
          key: String(clip.id),
          clip,
        })
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

export const Settings = SanneSettings;
