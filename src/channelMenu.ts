import { findAllExports } from "@metro/finders";
import { createSimpleFilter } from "@metro/factories";
import { ReactNative } from "@metro/common";

let done = false;

export function startChannelMenu() {
    if (done) return () => {};
    done = true;

    const filter = createSimpleFilter(
        (m: any) => {
            const name =
                m?.displayName ||
                m?.name ||
                m?.type?.displayName ||
                m?.type?.name;

            return (
                typeof name === "string" &&
                /attachment|upload|messageinput|composer|file/i.test(name)
            );
        },
        "sanne-attachment-components"
    );

    const found = findAllExports(filter);

    const names = found
        .map((m: any) =>
            m?.displayName ||
            m?.name ||
            m?.type?.displayName ||
            m?.type?.name
        )
        .filter(Boolean);

    ReactNative.Alert.alert(
        "SanneBridge",
        names.length
            ? names.slice(0, 30).join("\n")
            : "NO ATTACHMENT COMPONENT FOUND"
    );

    return () => {};
}
