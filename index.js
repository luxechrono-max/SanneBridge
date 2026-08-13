(function(exports,metro,common){'use strict';var settings = () => {
  const test = () => {
    const send = globalThis.__SanneSend;
    if (!send) {
      common.ReactNative.Alert.alert(
        "SanneBridge",
        "Sanne sender is NOT loaded."
      );
      return;
    }
    common.ReactNative.Alert.alert(
      "SanneBridge",
      "Sender ready. The next step will execute it against a real channel."
    );
  };
  return /* @__PURE__ */ React.createElement(common.ReactNative.ScrollView, null, /* @__PURE__ */ React.createElement(common.ReactNative.View, { style: { padding: 16 } }, /* @__PURE__ */ React.createElement(
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
  ), /* @__PURE__ */ React.createElement(
    common.ReactNative.TouchableOpacity,
    {
      onPress: test,
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
      "TEST SANNE SENDER"
    )
  )));
};const API = "https://sannewalid.aitnobajansen.workers.dev";
async function sendLatestSanne() {
  const r = await fetch(`${API}/bridge/sanne`, {
    cache: "no-store",
    headers: { Accept: "application/json" }
  });
  if (!r.ok) throw new Error(`Bridge HTTP ${r.status}`);
  const data = await r.json();
  const clips = Array.isArray(data?.clips) ? data.clips.filter((c) => c?.voice === "Sanne").slice(0, 5) : [];
  if (!clips.length) throw new Error("No Sanne clips found");
  const clip = clips.reduce(
    (a, b) => new Date(b.createdAt).getTime() > new Date(a.createdAt).getTime() ? b : a
  );
  const mp3 = await fetch(clip.url);
  if (!mp3.ok) throw new Error(`MP3 HTTP ${mp3.status}`);
  const bytes = new Uint8Array(
    await mp3.arrayBuffer()
  );
  let binary = "";
  for (let i = 0; i < bytes.length; i += 32768) {
    binary += String.fromCharCode(
      ...bytes.subarray(
        i,
        Math.min(i + 32768, bytes.length)
      )
    );
  }
  const fm = metro.findByProps(
    "writeFile",
    "getConstants"
  );
  if (!fm?.writeFile)
    throw new Error("Bunny FileManager not found");
  const filename = `sanne-${clip.id}.mp3`;
  const path = await fm.writeFile(
    "cache",
    filename,
    btoa(binary),
    "base64"
  );
  const uploader = metro.findByProps(
    "uploadLocalFiles"
  );
  if (!uploader?.uploadLocalFiles)
    throw new Error(
      "Discord uploadLocalFiles not found"
    );
  await uploader.uploadLocalFiles({
    items: [{
      uri: path,
      filename,
      mimeType: "audio/mpeg",
      size: bytes.length
    }],
    flags: 0
  });
}
const onLoad = () => {
  globalThis.__SanneSend = sendLatestSanne;
};
const onUnload = () => {
  delete globalThis.__SanneSend;
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro,vendetta.metro.common);