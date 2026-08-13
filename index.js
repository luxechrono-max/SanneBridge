(function(exports,common){'use strict';const API = "https://sannewalid.aitnobajansen.workers.dev";
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
      onPress: () => common.ReactNative.Alert.alert(
        "SanneBridge",
        "Button callback works."
      ),
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
};const onLoad = () => {
  globalThis.__SanneGetLatest = getLatestSanne;
};
const onUnload = () => {
  delete globalThis.__SanneGetLatest;
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro.common);