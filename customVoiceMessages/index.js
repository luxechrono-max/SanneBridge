(function(exports,metro,patcher,plugin,common,components,assets,storage){'use strict';function randomByte(min, max) {
  return Math.floor(
    min + Math.random() * (max - min + 1)
  );
}
function generateWaveform() {
  const samples = new Uint8Array(128);
  let current = randomByte(45, 100);
  for (let i = 0; i < samples.length; i++) {
    const target = randomByte(20, 230);
    current += (target - current) * (0.2 + Math.random() * 0.18);
    if (Math.random() < 0.06) {
      current = randomByte(160, 250);
    }
    if (Math.random() < 0.05) {
      current = randomByte(10, 45);
    }
    samples[i] = Math.max(
      1,
      Math.min(
        255,
        Math.round(current)
      )
    );
  }
  let binary = "";
  for (let i = 0; i < samples.length; i++) {
    binary += String.fromCharCode(
      samples[i]
    );
  }
  return btoa(binary);
}const VOICE_MESSAGE_FLAG = 8192;
function transform(item) {
  if (!item?.mimeType?.startsWith("audio")) return;
  item.mimeType = "audio/ogg";
  item.waveform = generateWaveform();
  item.duration_secs = item.duration_secs ?? item.durationSecs ?? 0;
  item.durationSecs = item.duration_secs;
}
function patchUpload(method) {
  const unpatches = [];
  try {
    const module = metro.findByProps(method);
    if (!module) return () => {
    };
    const unpatch = patcher.before(method, module, (args) => {
      try {
        const upload = args?.[0];
        if (!upload || !plugin.storage.sendAsVM) return;
        const item = upload.items?.[0] ?? upload;
        if (!item?.mimeType?.startsWith("audio")) return;
        transform(item);
        upload.flags = VOICE_MESSAGE_FLAG;
        if (upload.items?.[0]) {
          upload.items[0].flags = VOICE_MESSAGE_FLAG;
        }
      } catch {
      }
    });
    unpatches.push(unpatch);
  } catch {
  }
  return () => {
    unpatches.forEach((u) => {
      try {
        u();
      } catch {
      }
    });
  };
}
var voiceMessages = () => {
  const unpatches = [
    patchUpload("uploadLocalFiles"),
    patchUpload("CloudUpload")
  ];
  return () => {
    unpatches.forEach((u) => u());
  };
};function safePatch(event, callback) {
  try {
    const handlers = common.FluxDispatcher?._actionHandlers?._computeOrderedActionHandlers?.(event);
    const handler = handlers?.find(
      (i) => i.name === "MessageStore"
    );
    if (!handler) return () => {
    };
    return patcher.before("actionHandler", handler, callback);
  } catch {
    return () => {
    };
  }
}
function msgSuccess() {
  return safePatch("LOAD_MESSAGES_SUCCESS", (args) => {
    if (!plugin.storage.allAsVM) return;
    args?.[0]?.messages?.forEach((x) => {
      if (x.flags == 8192) return;
      x.attachments?.forEach((a) => {
        if (a?.content_type?.startsWith?.("audio")) {
          x.flags |= 8192;
          a.waveform = generateWaveform();
          a.duration_secs = 60;
        }
      });
    });
  });
}
function msgCreate() {
  return safePatch("MESSAGE_CREATE", (args) => {
    const message = args?.[0]?.message;
    if (!plugin.storage.allAsVM || message?.flags == 8192) return;
    if (message?.attachments?.[0]?.content_type?.startsWith("audio")) {
      message.flags |= 8192;
      message.attachments.forEach((x) => {
        x.waveform = generateWaveform();
        x.duration_secs = 60;
      });
    }
  });
}
function msgUpdate() {
  return safePatch("MESSAGE_UPDATE", (args) => {
    const message = args?.[0]?.message;
    if (!plugin.storage.allAsVM || message?.flags == 8192) return;
    if (message?.attachments?.[0]?.content_type?.startsWith("audio")) {
      message.flags |= 8192;
      message.attachments.forEach((x) => {
        x.waveform = generateWaveform();
        x.duration_secs = 60;
      });
    }
  });
}const { FormDivider, FormIcon, FormSwitchRow } = components.Forms;
var settings = () => {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ common.React.createElement(common.ReactNative.ScrollView, null, /* @__PURE__ */ common.React.createElement(
    FormSwitchRow,
    {
      label: "Send audio files as Voice Message",
      leading: /* @__PURE__ */ common.React.createElement(
        FormIcon,
        {
          source: assets.getAssetIDByName("voice_bar_mute_off")
        }
      ),
      onValueChange: (v) => plugin.storage.sendAsVM = v,
      value: plugin.storage.sendAsVM
    }
  ), /* @__PURE__ */ common.React.createElement(FormDivider, null), /* @__PURE__ */ common.React.createElement(
    FormSwitchRow,
    {
      label: "Show every audio file as a Voice Message",
      leading: /* @__PURE__ */ common.React.createElement(
        FormIcon,
        {
          source: assets.getAssetIDByName("ic_stage_music")
        }
      ),
      onValueChange: (v) => plugin.storage.allAsVM = v,
      value: plugin.storage.allAsVM
    }
  ));
};var _a, _b;
(_a = plugin.storage).sendAsVM ?? (_a.sendAsVM = true);
(_b = plugin.storage).allAsVM ?? (_b.allAsVM = false);
let patches = [];
const onLoad = () => {
  try {
    patches.push(voiceMessages());
  } catch (e) {
    console.log("[CustomVoiceMessages+] voiceMessages failed:", e);
  }
  try {
    patches.push(msgCreate());
    patches.push(msgSuccess());
    patches.push(msgUpdate());
  } catch (e) {
    console.log("[CustomVoiceMessages+] messagePatches failed:", e);
  }
};
const onUnload = () => {
  patches.forEach((p) => {
    try {
      p?.();
    } catch {
    }
  });
  patches = [];
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro,vendetta.patcher,vendetta.plugin,vendetta.metro.common,vendetta.ui.components,vendetta.ui.assets,vendetta.storage);