// components/AnimeContent.tsx
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {OpeningWithName} from "@/app/services/animethemesApi";
import {useTranslations} from "next-intl";
import AnimeGrid from "@/app/components/AnimeContent/AnimeGrid/AnimeGrid";
import configuration from "@/configuration";
import SpinningWheelModal from "@/app/components/Wheel/SpinningWheelModal";

interface AnimeContentProps {
    error: string | null;
    loading: boolean;
    animes: AnimeEntryModel[];
    selectedAnimes: AnimeEntryModel[];
    selectedIds: number[];
    showWheel: boolean;
    spinWheelSize: number;
    drawnAnime: AnimeEntryModel | null;
    openingTheme: OpeningWithName | undefined;
    onSelect: (id: number) => void;
    onClose: () => void;
    onSelection: (anime: AnimeEntryModel | null) => void;
}

const AnimeContent: React.FC<AnimeContentProps> = ({
                                                       error,
                                                       loading,
                                                       animes,
                                                       selectedAnimes,
                                                       selectedIds,
                                                       showWheel,
                                                       spinWheelSize,
                                                       drawnAnime,
                                                       openingTheme,
                                                       onSelect,
                                                       onClose,
                                                       onSelection
                                                   }) => {
    const t = useTranslations('Selections');

    return (
        <div className="mt-8 lg:mt-0 lg:w-3/4">
            <div className="mt-8 lg:mt-0">
                {error && <div className="text-red-500">{t('fetch_error')}</div>}
                {loading ? (
                    <div>{t('loading')}</div>
                ) : animes.length > 0 ? (
                    <AnimeGrid
                        models={animes}
                        selectedIds={selectedIds}
                        onSelect={onSelect}
                        wheelLimit={configuration.wheelLimit}
                    />
                ) : (
                    <div>{t('no_common')}</div>
                )}
            </div>

            {showWheel && selectedAnimes.length >= 2 && (
                <SpinningWheelModal
                    selectedAnimes={selectedAnimes}
                    onClose={onClose}
                    onSelection={onSelection}
                    spinWheelSize={spinWheelSize}
                    showConfetti={!!drawnAnime && configuration.enableConfetti}
                    openingTheme={openingTheme}
                    wheelLimit={configuration.wheelLimit}
                />
            )}
        </div>
    );
};

export default AnimeContent;