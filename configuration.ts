const configurationEnvs = {
    playFanfare: process.env.NEXT_PUBLIC_PLAY_FANFARE,
    playClicks: process.env.NEXT_PUBLIC_PLAY_CLICKS,
    enableConfetti: process.env.NEXT_PUBLIC_ENABLE_CONFETTI,
    enableOpenings: process.env.NEXT_PUBLIC_ENABLE_OPENINGS,
    openingsDefaultVolume: process.env.NEXT_PUBLIC_OPENINGS_DEFAULT_VOLUME,
    wheelLimit: process.env.NEXT_PUBLIC_WHEEL_LIMIT,
};

export const configuration = {
    playFanfare: parseBoolean(configurationEnvs.playFanfare, false),
    playClicks: parseBoolean(configurationEnvs.playClicks, true),
    enableConfetti: parseBoolean(configurationEnvs.enableConfetti, true),
    enableOpenings: parseBoolean(configurationEnvs.enableOpenings, true),
    openingsDefaultVolume: parseNumber(configurationEnvs.openingsDefaultVolume, 10),
    wheelLimit: parseNumber(configurationEnvs.wheelLimit, 25),
};

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    return value && !value.includes('BAKED_') ? value === "true" : defaultValue;
}

function parseNumber(value: string | undefined, defaultValue: number): number {
    return value && !value.includes('BAKED_') ? parseFloat(value) : defaultValue;
}

console.log("Loaded config", configuration);

export default configuration;