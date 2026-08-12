var SanneBridge = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });
  var import_common = __require("@vendetta/metro/common");
  var import_metro = __require("@vendetta/metro");
  var import_assets = __require("@vendetta/ui/assets");
  var import_common2 = __require("@vendetta/metro/common");
  var API = "https://sannewalid.aitnobajansen.workers.dev";
  var MAX_CLIPS = 5;
  function getFileManager() {
    const fm = (0, import_metro.findByProps)("writeFile", "getConstants");
    if (!fm?.writeFile || !fm?.getConstants) {
      throw new Error("Bunny/Kettu FileManager not found");
    }
    return fm;
  }
  function getUploader() {
    const uploader = (0, import_metro.findByProps)("uploadLocalFiles");
    if (!uploader?.uploadLocalFiles) {
      throw new Error("Discord uploadLocalFiles not found");
    }
    return uploader;
  }
  function formatTime(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
  async function getClips() {
    const r = await fetch(`${API}/bridge/sanne`, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });
    if (!r.ok) throw new Error(`Bridge HTTP ${r.status}`);
    const data = await r.json();
    if (!Array.isArray(data?.clips)) {
      throw new Error("Invalid bridge response");
    }
    return data.clips.filter((c) => c?.voice === "Sanne").slice(0, MAX_CLIPS);
  }
  async function downloadClip(clip) {
    const r = await fetch(clip.url);
    if (!r.ok) {
      throw new Error(`MP3 HTTP ${r.status}`);
    }
    const buffer = await r.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 32768;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(
        ...bytes.subarray(i, Math.min(i + chunkSize, bytes.length))
      );
    }
    const base64 = btoa(binary);
    const fm = getFileManager();
    const filename = `sanne-${clip.id}.mp3`;
    const path = await fm.writeFile(
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
  async function sendToDiscord(clip) {
    (0, import_common2.showToast)("Preparing Sanne voice message\u2026");
    const local = await downloadClip(clip);
    const uploader = getUploader();
    await uploader.uploadLocalFiles({
      items: [
        {
          uri: local.path,
          filename: local.filename,
          mimeType: "audio/mpeg",
          size: local.size,
          item: {
            uri: local.path,
            filename: local.filename,
            mimeType: "audio/mpeg",
            size: local.size
          }
        }
      ],
      flags: 0
    });
    (0, import_common2.showToast)(
      "Sanne clip added to Discord",
      (0, import_assets.getAssetIDByName)("Check")
    );
  }
  function SanneSettings() {
    const {
      ScrollView,
      View,
      Text,
      TouchableOpacity,
      ActivityIndicator
    } = import_common.ReactNative;
    const [clips, setClips] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const refresh = async () => {
      setLoading(true);
      setError("");
      try {
        setClips(await getClips());
      } catch (e) {
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
              marginBottom: 4
            }
          },
          "SanneBridge"
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#b5bac1",
              marginBottom: 14
            }
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
              marginBottom: 12
            }
          },
          React.createElement(
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
        loading ? React.createElement(ActivityIndicator, null) : null,
        error ? React.createElement(
          Text,
          {
            style: {
              color: "#f23f42",
              margin: 12
            }
          },
          error
        ) : null,
        !loading && !error && clips.length === 0 ? React.createElement(
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
          (clip) => React.createElement(
            View,
            {
              key: String(clip.id),
              style: {
                marginHorizontal: 0,
                marginBottom: 10,
                padding: 12,
                borderRadius: 10,
                backgroundColor: "#15171a"
              }
            },
            React.createElement(
              Text,
              {
                style: {
                  color: "white",
                  fontSize: 15,
                  fontWeight: "700"
                }
              },
              `Sanne \xB7 ${formatTime(clip.createdAt)}`
            ),
            React.createElement(
              Text,
              {
                style: {
                  color: "#949ba4",
                  marginTop: 3
                }
              },
              typeof clip.duration === "number" ? `${Math.round(clip.duration)}s` : "MP3"
            ),
            React.createElement(
              TouchableOpacity,
              {
                onPress: async () => {
                  try {
                    await sendToDiscord(clip);
                  } catch (e) {
                    (0, import_common2.showToast)(
                      String(e?.message || e),
                      (0, import_assets.getAssetIDByName)("Small")
                    );
                  }
                },
                style: {
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  backgroundColor: "#5865f2",
                  marginTop: 10
                }
              },
              React.createElement(
                Text,
                {
                  style: {
                    color: "white",
                    fontWeight: "700",
                    textAlign: "center"
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
  var React = (0, import_metro.findByProps)("createElement");
  var index_default = {
    onLoad() {
      console.log("[SanneBridge] loaded");
    },
    onUnload() {
      console.log("[SanneBridge] unloaded");
    },
    settings: SanneSettings
  };
  return __toCommonJS(index_exports);
})();
