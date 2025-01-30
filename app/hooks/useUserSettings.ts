import {useLocalStorage} from "usehooks-ts";
import configuration from "@/configuration";

interface UserSettings {
    autoplayOpening: boolean;
    audioVolume: number;
}

export default function useUserSettings() {
    const [userSettings, setUserSettings] = useLocalStorage<UserSettings>('userSettings', {
        autoplayOpening: true,
        audioVolume: configuration.openingsDefaultVolume
    });

    const setAutoplayOpening = (autoplayOpening: boolean) => {
        setUserSettings({...userSettings, autoplayOpening});
    }

    const setAudioVolume = (audioVolume: number) => {
        setUserSettings({...userSettings, audioVolume});
    }

    return {
        autoplayOpening: userSettings.autoplayOpening,
        audioVolume: userSettings.audioVolume,
        setAutoplayOpening,
        setAudioVolume
    }
}