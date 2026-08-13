(function(exports,common,metro){'use strict';var settings = () => {
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
      onPress: () => {
        common.ReactNative.Alert.alert(
          "SanneBridge",
          "Button callback works."
        );
      },
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
      "TEST SANNE BUTTON"
    )
  )));
};const API = "https://sannewalid.aitnobajansen.workers.dev";
let patches = [];
async function sendLatestSanne(channelId) {
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
  const clips = Array.isArray(data?.clips) ? data.clips.filter(
    (clip) => clip?.voice === "Sanne"
  ) : [];
  if (!clips.length) {
    throw new Error("No Sanne clips found");
  }
  const latest = clips.reduce(
    (a, b) => new Date(b.createdAt).getTime() > new Date(a.createdAt).getTime() ? b : a
  );
  const mp3 = await fetch(latest.url);
  if (!mp3.ok) {
    throw new Error(`MP3 HTTP ${mp3.status}`);
  }
  const buffer = await mp3.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 32768) {
    binary += String.fromCharCode(
      ...bytes.subarray(
        i,
        Math.min(i + 32768, bytes.length)
      )
    );
  }
  const base64 = btoa(binary);
  const files = metro.findByProps(
    "writeFile",
    "getConstants"
  );
  if (!files?.writeFile) {
    throw new Error("Kettu FileManager unavailable");
  }
  const filename = `sanne-${latest.id}.mp3`;
  const uri = await files.writeFile(
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
      "Discord uploader unavailable"
    );
  }
  await uploader.uploadLocalFiles({
    channelId,
    items: [
      {
        uri,
        filename,
        mimeType: "audio/mpeg",
        size: bytes.length
      }
    ],
    flags: 0
  });
}
const onLoad = () => {
  const unpatch = common.ContextMenu.patch(
    "channel-context",
    (ret, props) => {
      if (!ret || !props?.channel) {
        return ret;
      }
      const item = common.ContextMenu.buildItem({
        label: "Send Latest Sanne",
        action: async () => {
          try {
            await sendLatestSanne(
              props.channel.id
            );
          } catch (e) {
            console.error(
              "[SanneBridge]",
              e
            );
          }
        }
      });
      ret.props.children.push(item);
      return ret;
    }
  );
  patches.push(unpatch);
};
const onUnload = () => {
  patches.forEach((unpatch) => {
    try {
      unpatch();
    } catch {
    }
  });
  patches = [];
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro.common,vendetta.metro);