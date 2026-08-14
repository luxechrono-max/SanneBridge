var CustomVoiceMessagesPlus = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    onUnload: () => onUnload,
    settings: () => settings_default
  });

  // src/patches/voiceMessages.ts
  var import_metro = __require("@vendetta/metro");
  var import_patcher = __require("@vendetta/patcher");
  var import_plugin = __require("@vendetta/plugin");

  // src/waveform.ts
  function randomByte(min, max) {
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
  }

  // src/patches/voiceMessages.ts
  function transform(item) {
    if (item?.mimeType?.startsWith("audio")) {
      item.mimeType = "audio/ogg";
      item.waveform = generateWaveform();
      item.durationSecs = 60;
    }
  }
  var voiceMessages_default = () => {
    const unpatches = [];
    const patch = (method) => {
      try {
        const module = (0, import_metro.findByProps)(method);
        const unpatch = (0, import_patcher.before)(
          method,
          module,
          (args) => {
            const upload = args[0];
            if (!import_plugin.storage.sendAsVM || upload.flags === 8192) {
              return;
            }
            const item = upload.items?.[0] ?? upload;
            if (item?.mimeType?.startsWith("audio")) {
              transform(item);
              upload.flags = 8192;
            }
          }
        );
        unpatches.push(unpatch);
      } catch {
      }
    };
    patch("uploadLocalFiles");
    patch("CloudUpload");
    return () => unpatches.forEach(
      (u) => u()
    );
  };

  // src/patches/messagePatches.ts
  var import_patcher2 = __require("@vendetta/patcher");
  var import_common = __require("@vendetta/metro/common");
  var import_plugin2 = __require("@vendetta/plugin");
  function msgSuccess() {
    return (0, import_patcher2.before)(
      "actionHandler",
      import_common.FluxDispatcher._actionHandlers._computeOrderedActionHandlers("LOAD_MESSAGES_SUCCESS").find((i) => i.name === "MessageStore"),
      (args) => {
        if (!import_plugin2.storage.allAsVM) return;
        args[0].messages.forEach((x) => {
          if (x.flags == 8192) return;
          x.attachments.forEach((a) => {
            if (a.content_type?.startsWith?.("audio")) {
              x.flags |= 8192;
              a.waveform = generateWaveform();
              a.duration_secs = 60;
            }
          });
        });
      }
    );
  }
  function msgCreate() {
    return (0, import_patcher2.before)(
      "actionHandler",
      import_common.FluxDispatcher._actionHandlers._computeOrderedActionHandlers("MESSAGE_CREATE").find((i) => i.name === "MessageStore"),
      (args) => {
        if (!import_plugin2.storage.allAsVM || args[0].message.flags == 8192) return;
        const message = args[0].message;
        if (message?.attachments?.[0]?.content_type?.startsWith("audio")) {
          message.flags |= 8192;
          message.attachments.forEach((x) => {
            x.waveform = generateWaveform();
            x.duration_secs = 60;
          });
        }
      }
    );
  }
  function msgUpdate() {
    return (0, import_patcher2.before)(
      "actionHandler",
      import_common.FluxDispatcher._actionHandlers._computeOrderedActionHandlers("MESSAGE_UPDATE").find((i) => i.name === "MessageStore"),
      (args) => {
        if (!import_plugin2.storage.allAsVM || args[0].message.flags == 8192) return;
        const message = args[0].message;
        if (message?.attachments?.[0]?.content_type?.startsWith("audio")) {
          message.flags |= 8192;
          message.attachments.forEach((x) => {
            x.waveform = generateWaveform();
            x.duration_secs = 60;
          });
        }
      }
    );
  }

  // src/patches/download.tsx
  var import_patcher3 = __require("@vendetta/patcher");
  var import_assets = __require("@vendetta/ui/assets");
  var import_metro3 = __require("@vendetta/metro");
  var import_utils = __require("@vendetta/utils");
  var import_common3 = __require("@vendetta/metro/common");

  // src/components/CoolRow.tsx
  var import_metro2 = __require("@vendetta/metro");
  var import_common2 = __require("@vendetta/metro/common");
  var import_ui = __require("@vendetta/ui");
  var import_components = __require("@vendetta/ui/components");
  var { FormRow } = import_components.Forms;
  var ActionSheetRow = (0, import_metro2.findByProps)("ActionSheetRow")?.ActionSheetRow;
  function CoolRow_default({
    label,
    icon,
    onPress
  }) {
    const styles = import_common2.stylesheet.createThemedStyleSheet({
      iconComponent: {
        width: 24,
        height: 24,
        tintColor: import_ui.semanticColors.INTERACTIVE_NORMAL
      }
    });
    return ActionSheetRow ? /* @__PURE__ */ React.createElement(
      ActionSheetRow,
      {
        label,
        icon: /* @__PURE__ */ React.createElement(
          ActionSheetRow.Icon,
          {
            source: icon,
            IconComponent: () => /* @__PURE__ */ React.createElement(
              import_common2.ReactNative.Image,
              {
                resizeMode: "cover",
                style: styles.iconComponent,
                source: icon
              }
            )
          }
        ),
        onPress: () => onPress?.()
      }
    ) : /* @__PURE__ */ React.createElement(
      FormRow,
      {
        label,
        leading: /* @__PURE__ */ React.createElement(FormRow.Icon, { source: icon }),
        onPress: () => onPress?.()
      }
    );
  }

  // src/patches/download.tsx
  var ActionSheet = (0, import_metro3.findByProps)("openLazy", "hideActionSheet");
  var download_default = () => (0, import_patcher3.before)("openLazy", ActionSheet, (ctx) => {
    const [component, args, actionMessage] = ctx;
    const message = actionMessage?.message;
    if (args !== "MessageLongPressActionSheet" || !message) return;
    component.then((instance) => {
      const unpatch = (0, import_patcher3.after)("default", instance, (_, component2) => {
        import_common3.React.useEffect(() => () => {
          unpatch();
        }, []);
        const buttons = (0, import_utils.findInReactTree)(
          component2,
          (x) => x?.[0]?.type?.name === "ButtonRow"
        );
        if (!buttons) return component2;
        if (message.hasFlag(8192)) {
          buttons.splice(
            5,
            0,
            /* @__PURE__ */ import_common3.React.createElement(
              CoolRow_default,
              {
                label: "Download Voice Message",
                icon: (0, import_assets.getAssetIDByName)("ic_download_24px"),
                onPress: async () => {
                  await (0, import_metro3.findByProps)("downloadMediaAsset").downloadMediaAsset(message.attachments[0].url, 0);
                  (0, import_metro3.findByProps)("hideActionSheet").hideActionSheet();
                }
              }
            )
          );
          buttons.splice(
            6,
            0,
            /* @__PURE__ */ import_common3.React.createElement(
              CoolRow_default,
              {
                label: "Copy Voice Message URL",
                icon: (0, import_assets.getAssetIDByName)("copy"),
                onPress: async () => {
                  import_common3.clipboard.setString(message.attachments[0].url);
                  (0, import_metro3.findByProps)("hideActionSheet").hideActionSheet();
                }
              }
            )
          );
        }
      });
    });
  });

  // src/index.ts
  var import_plugin4 = __require("@vendetta/plugin");

  // src/settings.tsx
  var import_common4 = __require("@vendetta/metro/common");
  var import_components2 = __require("@vendetta/ui/components");
  var import_assets2 = __require("@vendetta/ui/assets");
  var import_plugin3 = __require("@vendetta/plugin");
  var import_storage = __require("@vendetta/storage");
  var { FormDivider, FormIcon, FormSwitchRow } = import_components2.Forms;
  var settings_default = () => {
    (0, import_storage.useProxy)(import_plugin3.storage);
    return /* @__PURE__ */ React.createElement(import_common4.ReactNative.ScrollView, null, /* @__PURE__ */ React.createElement(
      FormSwitchRow,
      {
        label: "Send audio files as Voice Message",
        leading: /* @__PURE__ */ React.createElement(
          FormIcon,
          {
            source: (0, import_assets2.getAssetIDByName)("voice_bar_mute_off")
          }
        ),
        onValueChange: (v) => import_plugin3.storage.sendAsVM = v,
        value: import_plugin3.storage.sendAsVM
      }
    ), /* @__PURE__ */ React.createElement(FormDivider, null), /* @__PURE__ */ React.createElement(
      FormSwitchRow,
      {
        label: "Show every audio file as a Voice Message",
        leading: /* @__PURE__ */ React.createElement(
          FormIcon,
          {
            source: (0, import_assets2.getAssetIDByName)("ic_stage_music")
          }
        ),
        onValueChange: (v) => import_plugin3.storage.allAsVM = v,
        value: import_plugin3.storage.allAsVM
      }
    ));
  };

  // src/index.ts
  import_plugin4.storage.sendAsVM ??= true;
  import_plugin4.storage.allAsVM ??= false;
  var patches = [
    voiceMessages_default(),
    msgCreate(),
    msgSuccess(),
    msgUpdate(),
    download_default()
  ];
  var onUnload = () => {
    patches.forEach((p) => p());
  };
  return __toCommonJS(index_exports);
})();
