(function(exports,metro,patcher,common){'use strict';let stop = null;
function startChannelMenu() {
  const contextMenu = metro.findByProps(
    "openContextMenu",
    "closeContextMenu"
  );
  if (!contextMenu?.openContextMenu) {
    throw new Error("Discord context menu unavailable");
  }
  stop = patcher.after(
    "openContextMenu",
    contextMenu,
    (_args, result) => {
      try {
        const children = result?.props?.children;
        if (Array.isArray(children)) {
          children.push({
            type: "button",
            label: "Send Latest Sanne",
            action: () => {
              console.log(
                "[SanneBridge] Send Latest Sanne"
              );
            }
          });
        }
      } catch (e) {
        console.log(
          "[SanneBridge] menu patch error",
          e
        );
      }
      return result;
    }
  );
  return () => {
    stop?.();
    stop = null;
  };
}var settings = () => {
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
};let stopChannelMenu = null;
const onLoad = () => {
  stopChannelMenu = startChannelMenu();
};
const onUnload = () => {
  stopChannelMenu?.();
  stopChannelMenu = null;
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro,vendetta.patcher,vendetta.metro.common);