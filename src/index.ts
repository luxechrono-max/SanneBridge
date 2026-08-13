import { findAllExports } from "@metro/finders";
import { createSimpleFilter } from "@metro/factories";
import { ReactNative } from "@metro/common";

export const onLoad = () => {
    const found = findAllExports(
        createSimpleFilter(
            (m: any) => {
                if (!m || typeof m !== "object") return false;

                return Object.keys(m).some((key) =>
                    /attachment|upload|file|composer|messageInput/i.test(key)
                );
            },
            "sanne-runtime-upload-search"
        )
    );

    const results = found
        .map((m: any) =>
            Object.keys(m).filter((key) =>
                /attachment|upload|file|composer|messageInput/i.test(key)
            )
        )
        .flat();

    ReactNative.Alert.alert(
        "SanneBridge",
        results.length
            ? [...new Set(results)].slice(0, 80).join("\n")
            : "NO MATCHING MODULE PROPERTIES"
    );
};

export const onUnload = () => {};

export { default as settings } from "./settings";
