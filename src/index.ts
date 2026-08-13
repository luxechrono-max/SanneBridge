const API = "https://sannewalid.aitnobajansen.workers.dev";

const getSanneClips = async () => {
    const response = await fetch(`${API}/bridge/sanne`, {
        cache: "no-store",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Bridge HTTP ${response.status}`);
    }

    const data = await response.json();

    return (data?.clips ?? [])
        .filter((clip: any) => clip?.voice === "Sanne")
        .slice(0, 5);
};

export const onLoad = () => {
    (globalThis as any).__SanneGetClips = getSanneClips;
};

export const onUnload = () => {
    delete (globalThis as any).__SanneGetClips;
};

export { default as settings } from "./settings";
