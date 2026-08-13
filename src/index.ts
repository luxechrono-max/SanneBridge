import { startChannelMenu } from "./channelMenu";

let stop: (() => void) | null = null;

export const onLoad = () => {
    stop = startChannelMenu();
};

export const onUnload = () => {
    stop?.();
    stop = null;
};

export { default as settings } from "./settings";
