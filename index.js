(function(exports,common,metro){'use strict';const API = "https://sannewalid.aitnobajansen.workers.dev";
async function getLatestSanne() {
  const response = await fetch(
    `${API}/bridge/sanne`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }
  );
  if (!response.ok) {
    throw new Error(
      `Bridge HTTP ${response.status}`
    );
  }
  const data = await response.json();
  const clips = Array.isArray(data?.clips) ? data.clips.filter(
    (clip) => clip?.voice === "Sanne"
  ) : [];
  if (!clips.length) {
    throw new Error(
      "No Sanne clips found"
    );
  }
  return clips.reduce(
    (latest, clip) => new Date(
      clip.createdAt
    ).getTime() > new Date(
      latest.createdAt
    ).getTime() ? clip : latest
  );
}var settings = () => {
  const sendLatest = () => {
    const getLatest = globalThis.__SanneGetLatest;
    if (!getLatest) {
      common.ReactNative.Alert.alert(
        "SanneBridge",
        "Sanne API is not loaded."
      );
      return;
    }
    getLatest().then(async (clip) => {
      const response = await fetch(clip.url);
      if (!response.ok) {
        throw new Error(
          `MP3 HTTP ${response.status}`
        );
      }
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 32768) {
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
      const fileManager = metro.findByProps(
        "writeFile",
        "getConstants"
      );
      if (!fileManager?.writeFile) {
        throw new Error(
          "Kettu FileManager not found"
        );
      }
      const filename = `sanne-${clip.id}.mp3`;
      const path = await fileManager.writeFile(
        "cache",
        filename,
        base64,
        "base64"
      );
      const uploader = metro.findByProps(
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
            size: bytes.length
          }
        ],
        flags: 0
      });
      common.ReactNative.Alert.alert(
        "SanneBridge",
        "Latest Sanne MP3 uploaded."
      );
    }).catch((e) => {
      common.ReactNative.Alert.alert(
        "SanneBridge Error",
        String(e?.message || e)
      );
    });
  };
  return /* @__PURE__ */ React.createElement(common.ReactNative.ScrollView, null, /* @__PURE__ */ React.createElement(
    common.ReactNative.View,
    {
      style: { padding: 16 }
    },
    /* @__PURE__ */ React.createElement(
      common.ReactNative.Text,
      {
        style: {
          color: "white",
          fontSize: 22,
          fontWeight: "800",
          marginBottom: 20
        }
      },
      "SanneBridge"
    ),
    /* @__PURE__ */ React.createElement(
      common.ReactNative.TouchableOpacity,
      {
        onPress: sendLatest,
        style: {
          padding: 16,
          borderRadius: 8,
          backgroundColor: "#5865f2"
        }
      },
      /* @__PURE__ */ React.createElement(
        common.ReactNative.Text,
        {
          style: {
            color: "white",
            textAlign: "center",
            fontWeight: "700"
          }
        },
        "SEND LATEST SANNE"
      )
    )
  ));
};const onLoad = () => {
  globalThis.__SanneGetLatest = getLatestSanne;
};
const onUnload = () => {
  delete globalThis.__SanneGetLatest;
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro.common,vendetta.metro);