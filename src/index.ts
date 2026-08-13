import { startChannelMenu } from "./channelMenu";

let stopChannelMenu: (() => void) | null = null;

export const onLoad = () => {
    stopChannelMenu = startChannelMenu();
};

export const onUnload = () => {
    stopChannelMenu?.();
    stopChannelMenu = null;
};

export { default as settings } from "./settings";
