(function(exports,finders,factories,common$1,common){'use strict';var settings = () => {
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
};const onLoad = () => {
  const found = finders.findAllExports(
    factories.createSimpleFilter(
      (m) => {
        if (!m || typeof m !== "object") return false;
        return Object.keys(m).some(
          (key) => /attachment|upload|file|composer|messageInput/i.test(key)
        );
      },
      "sanne-runtime-upload-search"
    )
  );
  const results = found.map(
    (m) => Object.keys(m).filter(
      (key) => /attachment|upload|file|composer|messageInput/i.test(key)
    )
  ).flat();
  common$1.ReactNative.Alert.alert(
    "SanneBridge",
    results.length ? [...new Set(results)].slice(0, 80).join("\n") : "NO MATCHING MODULE PROPERTIES"
  );
};
const onUnload = () => {
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},@metro/finders,@metro/factories,@metro/common,vendetta.metro.common);