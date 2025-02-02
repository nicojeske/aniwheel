import React, {useRef, useState} from 'react';
import Confetti from 'react-confetti-boom';
import configuration from '@/configuration';
import AnimeEntryModel from '@/app/models/AnimeEntry';
import {Wheel} from "@/app/components/Wheel/Wheel";
import AnimeCard from "@/app/components/AnimeContent/AnimeGrid/Card/AnimeCard";
import useWheelAnimation from "@/app/hooks/useWheelAnimation";
import {OpeningWithName} from "@/app/services/animethemesApi";
import AudioPlayer from "@/app/components/Wheel/AudioPlayer";
import {MediaSeason, MediaStatus} from "@/app/gql/graphql";
import {AnimatePresence, motion} from "framer-motion";
import useUserSettings from "@/app/hooks/useUserSettings";

interface SpinningWheelModalProps {
    selectedAnimes: AnimeEntryModel[];
    onClose: () => void;
    onSelection: (anime: AnimeEntryModel | null) => void;
    spinWheelSize: number;
    showConfetti: boolean;
    openingTheme: OpeningWithName | undefined;
    wheelLimit: number;
}

const SpinningWheelModal: React.FC<SpinningWheelModalProps> = ({
                                                                   selectedAnimes,
                                                                   onClose,
                                                                   onSelection,
                                                                   spinWheelSize = 400,
                                                                   showConfetti,
                                                                   openingTheme,
                                                                   wheelLimit
                                                               }) => {
    const wheelRef = useRef<SVGSVGElement>(null);

    function selectRandomAnimeTillLimit(animes: AnimeEntryModel[]): AnimeEntryModel[] {
        const limit = wheelLimit;
        const shuffled = animes.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(limit, animes.length));
    }

    const [filteredAnimes] = useState<AnimeEntryModel[]>(selectRandomAnimeTillLimit(selectedAnimes));
    const {autoplayOpening, setAutoplayOpening} = useUserSettings();

    const {isSpinning, selectedAnime, spinWheel} = useWheelAnimation({
        animes: filteredAnimes,
        wheelRef,
        onSelection,
    });

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                {showConfetti && configuration.enableConfetti && (
                    <div className="z-50">
                        <Confetti mode="fall" particleCount={200} shapeSize={10}/>
                    </div>
                )}

                <motion.div
                    className="bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-5xl w-full mx-4"
                    initial={{scale: 0.9, y: 20}}
                    animate={{scale: 1, y: 0}}
                    exit={{scale: 0.9, y: 20}}
                >
                    <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 text-white">
                        {/* Wheel Container */}
                        <motion.div
                            className="relative"
                        >
                            <Wheel
                                size={spinWheelSize}
                                entries={filteredAnimes.map(anime => anime.title)}
                                wheelRef={wheelRef}
                                stringWrapLength={25}
                            />
                        </motion.div>

                        {/* Right Panel */}
                        <div className="flex flex-col items-center gap-6 w-full md:w-96">
                            <motion.h3
                                className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                                animate={{scale: selectedAnime ? 1.1 : 1}}
                                transition={{duration: 0.3}}
                            >
                                {selectedAnime ? "The wheel has decided" : "Spin the wheel"}
                            </motion.h3>

                            <motion.div
                                layout
                                className="w-1/2 md:w-3/4 lg:w-full"
                            >
                                <AnimeCard
                                    selected={true}
                                    anime={selectedAnime ?? {
                                        title: "???",
                                        id: -1,
                                        coverImageUrlLarge: "/cover.jpeg",
                                        coverImageUrlMedium: "/cover.jpeg",
                                        averageScore: 0,
                                        genres: [],
                                        season: MediaSeason.Fall,
                                        episodeCount: 0,
                                        seasonYear: 0,
                                        status: MediaStatus.Finished
                                    }}
                                    onSelect={() => {
                                    }}
                                    showSelectionIndicator={false}
                                />
                            </motion.div>

                            {openingTheme && (
                                <motion.div
                                    className="w-full space-y-4"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                >
                                    <AudioPlayer src={openingTheme.openingUrl} title={openingTheme.name}
                                                 autoplay={autoplayOpening}/>
                                </motion.div>
                            )}

                            <div className={`flex items-center gap-4 w-full`}>
                                <ToggleAutoplayButton autoplayOpening={autoplayOpening} setAutoplayOpening={setAutoplayOpening} />
                            </div>

                            <div className="flex items-center gap-4 w-full">

                                <motion.button
                                    onClick={spinWheel}
                                    disabled={isSpinning}
                                    className={`
                                        flex-1 px-6 py-3 rounded-xl font-medium text-white
                                        transition-all duration-300 transform
                                        ${isSpinning
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:-translate-y-1'
                                    }
                                    `}
                                    whileTap={{scale: 0.95}}
                                >
                                    {isSpinning ? (
                                        <span className="flex items-center gap-2">
                                            <motion.div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                animate={{rotate: 360}}
                                                transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                            />
                                            Spinning...
                                        </span>
                                    ) : "Spin"}
                                </motion.button>

                                <motion.button
                                    onClick={onClose}
                                    className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
                                    whileTap={{scale: 0.95}}
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
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

interface ToggleAutoplayButtonProps {
    autoplayOpening: boolean;
    setAutoplayOpening: (autoplayOpening: boolean) => void;
}
const ToggleAutoplayButton= ({setAutoplayOpening, autoplayOpening}: ToggleAutoplayButtonProps ) => (
    <div className="flex items-center justify-between gap-5">
        <label className="text-sm text-gray-300">Autoplay Opening</label>
        <button
            onClick={() => setAutoplayOpening(!autoplayOpening)}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors duration-300 ease-in-out
                ${autoplayOpening ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-700'}
            `}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white
                    transition-transform duration-300 ease-in-out
                    ${autoplayOpening ? 'translate-x-6' : 'translate-x-1'}
                `}
            />
        </button>
    </div>
)

export default React.memo(SpinningWheelModal);
