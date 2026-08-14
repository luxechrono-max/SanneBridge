(function(exports,metro,patcher,plugin,common,assets,utils,ui,components,storage){'use strict';function randomByte(min, max) {
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
}function transform(item) {
  if (item?.mimeType?.startsWith("audio")) {
    item.mimeType = "audio/ogg";
    item.waveform = generateWaveform();
    item.durationSecs = 60;
  }
}
var voiceMessages = () => {
  const unpatches = [];
  const patch = (method) => {
    try {
      const module = metro.findByProps(method);
      const unpatch = patcher.before(
        method,
        module,
        (args) => {
          const upload = args[0];
          if (!plugin.storage.sendAsVM || upload.flags === 8192) {
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
}const { FormRow } = components.Forms;
const ActionSheetRow = metro.findByProps("ActionSheetRow")?.ActionSheetRow;
function CoolRow({
  label,
  icon,
  onPress
}) {
  const styles = common.stylesheet.createThemedStyleSheet({
    iconComponent: {
      width: 24,
      height: 24,
      tintColor: ui.semanticColors.INTERACTIVE_NORMAL
    }
  });
  return ActionSheetRow ? /* @__PURE__ */ common.React.createElement(
    ActionSheetRow,
    {
      label,
      icon: /* @__PURE__ */ common.React.createElement(
        ActionSheetRow.Icon,
        {
          source: icon,
          IconComponent: () => /* @__PURE__ */ common.React.createElement(
            common.ReactNative.Image,
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
  ) : /* @__PURE__ */ common.React.createElement(
    FormRow,
    {
      label,
      leading: /* @__PURE__ */ common.React.createElement(FormRow.Icon, { source: icon }),
      onPress: () => onPress?.()
    }
  );
}var download = () => {
  const unpatches = [];
  try {
    const ActionSheet = metro.findByProps(
      "openLazy",
      "hideActionSheet"
    );
    if (!ActionSheet) return () => {
    };
    const unpatch = patcher.before(
      "openLazy",
      ActionSheet,
      (ctx) => {
        try {
          const [component, args, actionMessage] = ctx;
          const message = actionMessage?.message;
          if (args !== "MessageLongPressActionSheet" || !message) {
            return;
          }
          component?.then?.((instance) => {
            try {
              const unpatchAfter = patcher.after(
                "default",
                instance,
                (_, component2) => {
                  const buttons = utils.findInReactTree(
                    component2,
                    (x) => x?.[0]?.type?.name === "ButtonRow"
                  );
                  if (!buttons) return component2;
                  if (message.hasFlag?.(8192)) {
                    buttons.splice(
                      5,
                      0,
                      common.React.createElement(CoolRow, {
                        label: "Download Voice Message",
                        icon: assets.getAssetIDByName(
                          "ic_download_24px"
                        ),
                        onPress: async () => {
                          try {
                            await metro.findByProps(
                              "downloadMediaAsset"
                            )?.downloadMediaAsset(
                              message.attachments[0].url,
                              0
                            );
                            metro.findByProps(
                              "hideActionSheet"
                            )?.hideActionSheet();
                          } catch {
                          }
                        }
                      })
                    );
                    buttons.splice(
                      6,
                      0,
                      common.React.createElement(CoolRow, {
                        label: "Copy Voice Message URL",
                        icon: assets.getAssetIDByName("copy"),
                        onPress: async () => {
                          try {
                            const { clipboard } = require("@vendetta/metro/common");
                            clipboard.setString(
                              message.attachments[0].url
                            );
                            metro.findByProps(
                              "hideActionSheet"
                            )?.hideActionSheet();
                          } catch {
                          }
                        }
                      })
                    );
                  }
                  return component2;
                }
              );
              unpatches.push(unpatchAfter);
            } catch {
            }
          });
        } catch {
        }
      }
    );
    unpatches.push(unpatch);
  } catch {
  }
  return () => {
    unpatches.forEach((u) => {
      try {
        u?.();
      } catch {
      }
    });
  };
};const { FormDivider, FormIcon, FormSwitchRow } = components.Forms;
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
  try {
    patches.push(download());
  } catch (e) {
    console.log("[CustomVoiceMessages+] download failed:", e);
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
};exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro,vendetta.patcher,vendetta.plugin,vendetta.metro.common,vendetta.ui.assets,vendetta.utils,vendetta.ui,vendetta.ui.components,vendetta.storage);