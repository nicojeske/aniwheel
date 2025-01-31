// components/AnimeContent.tsx
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {OpeningWithName} from "@/app/services/animethemesApi";
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

    if (error) {
        return <ErrorComponent message={error} />;
    }

    return (
        <div className="mt-8 lg:mt-0 lg:w-3/4">
            <div className="mt-8 lg:mt-0">
                {loading ? (
                    <div>Loading...</div>
                ) : animes.length > 0 ? (
                    <AnimeGrid
                        models={animes}
                        selectedIds={selectedIds}
                        onSelect={onSelect}
                        wheelLimit={configuration.wheelLimit}
                    />
                ) : (
                    <div>No common animes found</div>
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

const ErrorComponent = ({ message }: { message: string }) => {
        return (
            <div className="flex flex-col items-center min-h-[200px] p-6 text-center">
                <div className="max-w-md w-full">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Exclamation icon */}
                        <svg
                            className="w-16 h-16 text-red-400 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>

                        {/* Error text */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-red-600">
                                Oops! Something went wrong
                            </h2>
                            <p className="text-red-500 text-sm font-medium">
                                {message.split('\n').map((line: string, index: number) => (
                                    <span key={index} className="block">
                                        {line}
                                    </span>
                                ))}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        );
}

export default AnimeContent;