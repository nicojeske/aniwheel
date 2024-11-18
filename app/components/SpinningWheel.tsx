// SpinningWheel.tsx
import React, { useRef } from 'react';
import AnimeCard from '@/app/components/AnimeCard';
import AnimeEntryModel from '@/app/models/AnimeEntry';
import { useTranslations } from 'next-intl';
import useWheelAnimation from "@/app/hooks/useWheelAnimation";
import {Wheel} from "@/app/components/Wheel";

type SpinningWheelProps = {
    animes: AnimeEntryModel[];
    onClose: () => void;
    size?: number;
    onSelection?: (anime: AnimeEntryModel | null) => void;
};

export default function SpinningWheel({
                                          animes,
                                          onClose,
                                          size = 400,
                                          onSelection = () => {},
                                      }: SpinningWheelProps) {
    const t = useTranslations('Spinner');
    const wheelRef = useRef<SVGSVGElement>(null);

    const { isSpinning, selectedAnime, spinWheel } = useWheelAnimation({
        animes,
        wheelRef,
        onSelection,
    });

    console.log(animes)

    return (
        <div className="relative flex flex-row items-center text-white gap-10">
            {/* Wheel Container */}
            <Wheel
                size={size}
                entries={animes.map(anime => anime.title)}
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
                        coverImageUrl={selectedAnime ? selectedAnime.coverImageUrl : '/cover.webp'}
                        selected={true}
                        title={selectedAnime ? selectedAnime.title : '???'}
                        id={selectedAnime ? selectedAnime.id : 0}
                        onSelect={() => {}}
                        showSelectionIndicator={false}
                    />
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
