(function(exports,common,metro,assets){'use strict';const API = "https://sannewalid.aitnobajansen.workers.dev";
const MAX_CLIPS = 5;
async function getClips() {
  const response = await fetch(`${API}/bridge/sanne`, {
    cache: "no-store",
    headers: {
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Bridge HTTP ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data?.clips)) {
    throw new Error("Invalid bridge response");
  }
  return data.clips.filter((clip) => clip?.voice === "Sanne").slice(0, MAX_CLIPS);
}
async function downloadClip(clip) {
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
  const fileManager = metro.findByProps("writeFile", "getConstants");
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
    size: bytes.length
  };
}
async function sendSanne(clip) {
  common.showToast("Preparing Sanne\u2026");
  const local = await downloadClip(clip);
  const uploader = metro.findByProps("uploadLocalFiles");
  if (!uploader?.uploadLocalFiles) {
    throw new Error("Discord uploadLocalFiles not found");
  }
  await uploader.uploadLocalFiles({
    items: [
      {
        uri: local.path,
        filename: local.filename,
        mimeType: "audio/mpeg",
        size: local.size
      }
    ],
    flags: 0
  });
  common.showToast(
    "Sanne voice message sent",
    assets.getAssetIDByName("Check")
  );
}
function SanneSettings() {
  const {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
  } = common.ReactNative;
  const [clips, setClips] = common.React.useState([]);
  const [loading, setLoading] = common.React.useState(true);
  const [error, setError] = common.React.useState("");
  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getClips();
      setClips(result);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };
  common.React.useEffect(() => {
    refresh();
  }, []);
  return common.React.createElement(
    ScrollView,
    null,
    common.React.createElement(
      View,
      {
        style: {
          padding: 16
        }
      },
      common.React.createElement(
        Text,
        {
          style: {
            color: "white",
            fontSize: 22,
            fontWeight: "800",
            marginBottom: 4
          }
        },
        "SanneBridge"
      ),
      common.React.createElement(
        Text,
        {
          style: {
            color: "#b5bac1",
            marginBottom: 14
          }
        },
        "Latest 5 Sanne clips"
      ),
      common.React.createElement(
        TouchableOpacity,
        {
          onPress: refresh,
          style: {
            padding: 12,
            borderRadius: 8,
            backgroundColor: "#2b2d31",
            marginBottom: 12
          }
        },
        common.React.createElement(
          Text,
          {
            style: {
              color: "white",
              textAlign: "center",
              fontWeight: "700"
            }
          },
          "REFRESH"
        )
      ),
      loading ? common.React.createElement(ActivityIndicator, null) : null,
      error ? common.React.createElement(
        Text,
        {
          style: {
            color: "#f23f42",
            margin: 12
          }
        },
        error
      ) : null,
      !loading && !error && clips.length === 0 ? common.React.createElement(
        Text,
        {
          style: {
            color: "#b5bac1",
            margin: 12
          }
        },
        "No Sanne clips available."
      ) : null,
      ...clips.map(
        (clip) => common.React.createElement(
          View,
          {
            key: String(clip.id),
            style: {
              marginBottom: 10,
              padding: 12,
              borderRadius: 10,
              backgroundColor: "#15171a"
            }
          },
          common.React.createElement(
            Text,
            {
              style: {
                color: "white",
                fontSize: 15,
                fontWeight: "700"
              }
            },
            `Sanne \xB7 ${new Date(
              clip.createdAt
            ).toLocaleTimeString()}`
          ),
          common.React.createElement(
            Text,
            {
              style: {
                color: "#949ba4",
                marginTop: 3
              }
            },
            typeof clip.duration === "number" ? `${Math.round(clip.duration)}s` : "MP3"
          ),
          common.React.createElement(
            TouchableOpacity,
            {
              onPress: async () => {
                try {
                  await sendSanne(clip);
                } catch (e) {
                  console.error(
                    "[SanneBridge]",
                    e
                  );
                  common.showToast(
                    String(e?.message || e),
                    assets.getAssetIDByName("Small")
                  );
                }
              },
              style: {
                marginTop: 10,
                paddingVertical: 11,
                borderRadius: 8,
                backgroundColor: "#5865f2"
              }
            },
            common.React.createElement(
              Text,
              {
                style: {
                  color: "white",
                  textAlign: "center",
                  fontWeight: "700"
                }
              },
              "SEND TO DISCORD"
            )
          )
        )
      )
    )
  );
}
const onLoad = () => {
  console.log("[SanneBridge] loaded");
};
const onUnload = () => {
  console.log("[SanneBridge] unloaded");
};
const settings = SanneSettings;exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro.common,vendetta.metro,vendetta.ui.assets);