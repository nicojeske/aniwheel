import CustomButton from "@/app/components/Configuration/CustomButton";
import MediaListStatusSelector from "@/app/components/Configuration/MediaListStatusSelector";
import UsernameInputs from "@/app/components/Configuration/UsernameInputs";
import KofiButton from "@/app/components/KofiButton";
import {UserSelection} from "@/app/models/UserSelection";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {MediaListStatus} from "@/app/gql/graphql";

interface ConfigurationPanelProps {
    userSelection: UserSelection;
    loading: boolean;
    isClient: boolean;
    showWheel: boolean;
    animes: AnimeEntryModel[];
    selectedAnimes: AnimeEntryModel[];
    onSetUsernames: (usernames: string[]) => void;
    onSetWatchState: (state: MediaListStatus) => void;
    onFetchAnimes: () => void;
    onShowWheel: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
                                                                   userSelection,
                                                                   loading,
                                                                   isClient,
                                                                   showWheel,
                                                                   animes,
                                                                   selectedAnimes,
                                                                   onSetUsernames,
                                                                   onSetWatchState,
                                                                   onFetchAnimes,
                                                                   onShowWheel
                                                               }) => {

    return (
        <>
            <KofiButton isShowing={!showWheel}/>
            <UsernameInputs
                usernames={userSelection.userNames}
                setUsernames={onSetUsernames}
            />
            <MediaListStatusSelector
                selectedWatchState={userSelection.watchState}
                setSelectedWatchState={onSetWatchState}
            />
            <CustomButton
                disabled={loading || (isClient && !userSelection.userNames.some(u => u.trim()))}
                onClick={onFetchAnimes}
                color="secondary"
                text="Fetch animes..."
                disabledText="Please add a user"
                loading={loading}
            />
            {animes && animes.length > 0 && (
                <CustomButton
                    onClick={onShowWheel}
                    text="Open the wheel"
                    color="tertiary"
                    disabled={selectedAnimes.length < 2}
                />
            )}
        </>
    );
};

export default ConfigurationPanel;