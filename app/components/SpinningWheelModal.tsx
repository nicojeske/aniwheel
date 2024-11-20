import React, {useRef} from 'react';
import Confetti from 'react-confetti-boom';
import configuration from '@/configuration';
import AnimeEntryModel from '@/app/models/AnimeEntry';
import {Wheel} from "@/app/components/Wheel";
import AnimeCard from "@/app/components/AnimeGrid/AnimeCard";
import {useTranslations} from "next-intl";
import useWheelAnimation from "@/app/hooks/useWheelAnimation";
import {OpeningWithName} from "@/app/services/animethemesApi";
import AudioPlayer from "@/app/components/AudioPlayer";
import {MediaSeason, MediaStatus} from "@/app/gql/graphql";
import {AnimatePresence, motion} from "framer-motion";

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
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {showConfetti && configuration.enableConfetti && (
                    <div className="z-50">
                        <Confetti mode="fall" particleCount={500} shapeSize={20}/>
                    </div>
                )}

                <motion.div
                    className="bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-5xl w-full mx-4"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                >
                    <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 text-white">
                        {/* Wheel Container */}
                        <motion.div
                            className="relative"
                        >
                            <Wheel
                                size={spinWheelSize}
                                entries={selectedAnimes.map(anime => anime.title)}
                                wheelRef={wheelRef}
                                stringWrapLength={25}
                            />
                        </motion.div>

                        {/* Right Panel */}
                        <div className="flex flex-col items-center gap-6 w-full md:w-96">
                            <motion.h3
                                className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                                animate={{ scale: selectedAnime ? 1.1 : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {selectedAnime ? t('decided_title') : t('undecided_title')}
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
                                        coverImageUrl: "/cover.jpeg",
                                        averageScore: 0,
                                        genres: [],
                                        season: MediaSeason.Fall,
                                        episodeCount: 0,
                                        seasonYear: 0,
                                        status: MediaStatus.Finished
                                    }}
                                    onSelect={() => {}}
                                    showSelectionIndicator={false}
                                />
                            </motion.div>

                            {openingTheme && (
                                <motion.div
                                    className="w-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <AudioPlayer src={openingTheme.openingUrl} title={openingTheme.name} autoplay/>
                                </motion.div>
                            )}

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
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isSpinning ? (
                                        <span className="flex items-center gap-2">
                                            <motion.div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            {t('spinning')}
                                        </span>
                                    ) : t('spin_button')}
                                </motion.button>

                                <motion.button
                                    onClick={onClose}
                                    className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
                                    whileTap={{ scale: 0.95 }}
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

export default React.memo(SpinningWheelModal);
