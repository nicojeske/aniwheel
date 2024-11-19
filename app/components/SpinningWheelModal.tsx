import React, {useRef} from 'react';
import Confetti from 'react-confetti-boom';
import configuration from '@/configuration';
import AnimeEntryModel from '@/app/models/AnimeEntry';
import {Wheel} from "@/app/components/Wheel";
import AnimeCard from "@/app/components/AnimeCard";
import {useTranslations} from "next-intl";
import useWheelAnimation from "@/app/hooks/useWheelAnimation";
import {OpeningWithName} from "@/app/services/animethemesApi";
import AudioPlayer from "@/app/components/AudioPlayer";

interface SpinningWheelModalProps {
    selectedAnimes: AnimeEntryModel[];
    onClose: () => void;
    onSelection: (anime: AnimeEntryModel | null) => void;
    spinWheelSize: number;
    showConfetti: boolean;
    openingTheme: OpeningWithName | undefined;
}

const SpinningWheelModal: React.FC<SpinningWheelModalProps> = ({
                                                                   selectedAnimes,
                                                                   onClose,
                                                                   onSelection,
                                                                   spinWheelSize = 400,
                                                                   showConfetti,
                                                                   openingTheme
                                                               }) => {

    const t = useTranslations('Spinner');
    const wheelRef = useRef<SVGSVGElement>(null);

    const {isSpinning, selectedAnime, spinWheel} = useWheelAnimation({
        animes: selectedAnimes,
        wheelRef,
        onSelection,
    });

    return (

        <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
            {/* Confetti */}
            {showConfetti && configuration.enableConfetti && (
                <div className={"z-50"}>
                    <Confetti mode="fall" particleCount={500} shapeSize={20}/>
                </div>
            )}

            {/* Modal Content */}
            <div className="bg-gray-900 p-4 rounded-lg">
                <div className="relative flex flex-row items-center text-white gap-10">
                    {/* Wheel Container */}
                    <Wheel
                        size={spinWheelSize}
                        entries={selectedAnimes.map(anime => anime.title)}
                        wheelRef={wheelRef}
                        stringWrapLength={25}
                    />

                    {/* Selected Anime and Buttons */}
                    <div>
                        <div className="mt-4 text-center">
                            <h3 className="text-lg font-semibold">
                                {selectedAnime ? t('decided_title') : t('undecided_title')}
                            </h3>
                            <AnimeCard
                                coverImageUrl={selectedAnime ? selectedAnime.coverImageUrl : '/cover.jpeg'}
                                selected={true}
                                title={selectedAnime ? selectedAnime.title : '???'}
                                id={selectedAnime ? selectedAnime.id : 0}
                                onSelect={() => {
                                }}
                                showSelectionIndicator={false}
                            />
                            {openingTheme && (
                                <div className={"pt-2"}>
                                    <AudioPlayer src={openingTheme.openingUrl} title={openingTheme.name} autoplay/>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center flex-row mt-4 gap-4">
                            {/* Spin Button */}
                            <button
                                onClick={spinWheel}
                                className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 w-3/4"
                                disabled={isSpinning}
                            >
                                {isSpinning ? t('spinning') : t('spin_button')}
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 w-1/4 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SpinningWheelModal);
