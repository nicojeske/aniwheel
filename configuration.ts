const configurationEnvs = {
    playFanfare: process.env.NEXT_PUBLIC_PLAY_FANFARE,
    playClicks: process.env.NEXT_PUBLIC_PLAY_CLICKS,
    enableConfetti: process.env.NEXT_PUBLIC_ENABLE_CONFETTI
};

export const configuration = {
    playFanfare: configurationEnvs.playFanfare
        ? configurationEnvs.playFanfare === "true"
        : false,
    playClicks: configurationEnvs.playClicks
        ? configurationEnvs.playClicks === "true"
        : true,
    enableConfetti: configurationEnvs.enableConfetti
        ? configurationEnvs.enableConfetti === "true"
        : true
};

export default configuration;