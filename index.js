(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/index.ts
  var import_common = __require("@vendetta/metro/common");
  var import_metro = __require("@vendetta/metro");
  var import_components = __require("@vendetta/ui/components");
  var import_assets = __require("@vendetta/ui/assets");
  var import_common2 = __require("@vendetta/metro/common");
  var API = "https://sannewalid.aitnobajansen.workers.dev";
  var MAX_CLIPS = 5;
  var { FormRow, FormText, FormIcon, FormDivider } = import_components.Forms;
  function getFileManager() {
    const fm = (0, import_metro.findByProps)("writeFile", "getConstants");
    if (!fm?.writeFile || !fm?.getConstants) {
      throw new Error("Bunny FileManager not found");
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
    if (Number.isNaN(d.getTime())) return value;
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
    if (!Array.isArray(data?.clips)) throw new Error("Invalid bridge response");
    return data.clips.filter((c) => c?.voice === "Sanne").slice(0, MAX_CLIPS);
  }
  async function downloadClip(clip) {
    const r = await fetch(clip.url);
    if (!r.ok) throw new Error(`MP3 HTTP ${r.status}`);
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
    const path = await fm.writeFile("cache", filename, base64, "base64");
    return {
      path,
      filename,
      size: bytes.length
    };
  }
  async function sendToDiscord(clip) {
    (0, import_common2.showToast)("Preparing Sanne voice message\xE2\x80\xA6");
    const local = await downloadClip(clip);
    const uploader = getUploader();
    const item = {
      uri: local.path,
      filename: local.filename,
      mimeType: "audio/mpeg",
      size: local.size
    };
    await uploader.uploadLocalFiles({
      items: [{
        ...item,
        item: { ...item }
      }],
      flags: 0
    });
    (0, import_common2.showToast)("Sanne clip added to Discord", (0, import_assets.getAssetIDByName)("Check"));
  }
  function ClipRow({ clip }) {
    const { View, Text, TouchableOpacity } = import_common.ReactNative;
    const duration = typeof clip.duration === "number" && clip.duration > 0 ? `${Math.round(clip.duration)}s` : "MP3";
    return /* @__PURE__ */ React.createElement(View, { style: {
      marginHorizontal: 12,
      marginBottom: 10,
      padding: 12,
      borderRadius: 10,
      backgroundColor: "#15171a"
    } }, /* @__PURE__ */ React.createElement(Text, { style: { color: "white", fontSize: 15, fontWeight: "700" } }, "Sanne \xC2\xB7 ", formatTime(clip.createdAt)), /* @__PURE__ */ React.createElement(Text, { style: { color: "#949ba4", marginTop: 3 } }, duration), /* @__PURE__ */ React.createElement(View, { style: { flexDirection: "row", marginTop: 10 } }, /* @__PURE__ */ React.createElement(
      TouchableOpacity,
      {
        onPress: () => import_common.ReactNative.Linking.openURL(clip.url),
        style: {
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 8,
          backgroundColor: "#2b2d31",
          marginRight: 8
        }
      },
      /* @__PURE__ */ React.createElement(Text, { style: { color: "white", fontWeight: "700" } }, "Preview")
    ), /* @__PURE__ */ React.createElement(
      TouchableOpacity,
      {
        onPress: async () => {
          try {
            await sendToDiscord(clip);
          } catch (e) {
            console.error("[SanneBridge]", e);
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
          backgroundColor: "#5865f2"
        }
      },
      /* @__PURE__ */ React.createElement(Text, { style: { color: "white", fontWeight: "700" } }, "SEND TO DISCORD")
    )));
  }
  var index_default = () => {
    const { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } = import_common.ReactNative;
    const [clips, setClips] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
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
    return /* @__PURE__ */ React.createElement(ScrollView, null, /* @__PURE__ */ React.createElement(View, { style: { padding: 16 } }, /* @__PURE__ */ React.createElement(Text, { style: {
      color: "white",
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 4
    } }, "SanneBridge"), /* @__PURE__ */ React.createElement(Text, { style: { color: "#b5bac1", marginBottom: 14 } }, "Latest 5 Sanne clips"), /* @__PURE__ */ React.createElement(
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
      /* @__PURE__ */ React.createElement(Text, { style: {
        color: "white",
        textAlign: "center",
        fontWeight: "700"
      } }, "REFRESH")
    ), loading && /* @__PURE__ */ React.createElement(ActivityIndicator, null), !!error && /* @__PURE__ */ React.createElement(Text, { style: { color: "#f23f42", margin: 12 } }, error), !loading && !error && clips.length === 0 && /* @__PURE__ */ React.createElement(Text, { style: { color: "#b5bac1", margin: 12 } }, "No Sanne clips available."), clips.map((clip) => /* @__PURE__ */ React.createElement(ClipRow, { key: clip.id, clip }))));
  };
})();
