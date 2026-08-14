function randomByte(min: number, max: number): number {
    return Math.floor(
        min + Math.random() * (max - min + 1)
    );
}

export function generateWaveform(): string {
    const samples = new Uint8Array(128);

    let current = randomByte(45, 100);

    for (let i = 0; i < samples.length; i++) {
        const target = randomByte(20, 230);

        current +=
            (target - current) *
            (0.20 + Math.random() * 0.18);

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
