(function(exports,common){'use strict';var settings = () => {
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
      onPress: async () => {
        try {
          const getLatest = globalThis.__SanneGetLatest;
          if (!getLatest) {
            throw new Error(
              "SanneBridge API unavailable"
            );
          }
          const clip = await getLatest();
          common.ReactNative.Alert.alert(
            "Latest Sanne",
            `Timestamp:
${clip.createdAt}

Clip ID:
${clip.id}

URL:
${clip.url}`
          );
        } catch (e) {
          common.ReactNative.Alert.alert(
            "SanneBridge Error",
            String(e?.message || e)
          );
        }
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
      "FETCH LATEST SANNE"
    )
  )));
};const onLoad = () => {
  console.log("[SanneBridge] loaded");
};
const onUnload = () => {
  console.log("[SanneBridge] unloaded");
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro.common);