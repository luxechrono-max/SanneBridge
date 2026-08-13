(function(exports,wrappers,common,common$1){'use strict';let ran = false;
function startChannelMenu() {
  if (ran) return () => {
  };
  ran = true;
  const candidates = [
    "sendMessage",
    "sendMessageWithAttachments",
    "uploadFile",
    "uploadFiles",
    "pickFile",
    "pickFiles",
    "openAttachmentPicker",
    "toggleAttachmentPicker"
  ];
  const results = [];
  for (const prop of candidates) {
    try {
      const modules = wrappers.findByPropsAll(prop);
      if (modules?.length) {
        results.push(`${prop}: ${modules.length}`);
      }
    } catch {
    }
  }
  common.ReactNative.Alert.alert(
    "SanneBridge",
    results.length ? results.join("\n") : "No attachment/upload modules found"
  );
  return () => {
  };
}var settings = () => {
  const test = () => {
    const send = globalThis.__SanneSend;
    if (!send) {
      common$1.ReactNative.Alert.alert(
        "SanneBridge",
        "Sanne sender is NOT loaded."
      );
      return;
    }
    common$1.ReactNative.Alert.alert(
      "SanneBridge",
      "Sender ready. The next step will execute it against a real channel."
    );
  };
  return /* @__PURE__ */ React.createElement(common$1.ReactNative.ScrollView, null, /* @__PURE__ */ React.createElement(common$1.ReactNative.View, { style: { padding: 16 } }, /* @__PURE__ */ React.createElement(
    common$1.ReactNative.Text,
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
    common$1.ReactNative.TouchableOpacity,
    {
      onPress: test,
      style: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#5865f2"
      }
    },
    /* @__PURE__ */ React.createElement(
      common$1.ReactNative.Text,
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
};let stop = null;
const onLoad = () => {
  stop = startChannelMenu();
};
const onUnload = () => {
  stop?.();
  stop = null;
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},@metro/wrappers,@metro/common,vendetta.metro.common);