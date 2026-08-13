const API = "https://sannewalid.aitnobajansen.workers.dev";

export async function getLatestSanne() {
    const response = await fetch(
        `${API}/bridge/sanne`,
        {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Bridge HTTP ${response.status}`
        );
    }

    const data = await response.json();

    const clips = Array.isArray(data?.clips)
        ? data.clips.filter(
            (clip: any) =>
                clip?.voice === "Sanne"
        )
        : [];

    if (!clips.length) {
        throw new Error(
            "No Sanne clips found"
        );
    }

    return clips.reduce(
        (latest: any, clip: any) =>
            new Date(
                clip.createdAt
            ).getTime() >
            new Date(
                latest.createdAt
            ).getTime()
                ? clip
                : latest
    );
}
