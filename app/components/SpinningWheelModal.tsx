import React from 'react';
import Confetti from 'react-confetti-boom';
import configuration from '@/configuration';
import SpinningWheel from '@/app/components/SpinningWheel';
import AnimeEntryModel from '@/app/models/AnimeEntry';

interface SpinningWheelModalProps {
    selectedAnimes: AnimeEntryModel[];
    onClose: () => void;
    onSelection: (anime: AnimeEntryModel | null) => void;
    spinWheelSize: number;
    showConfetti: boolean;
}

const SpinningWheelModal: React.FC<SpinningWheelModalProps> = ({
                                                                   selectedAnimes,
                                                                   onClose,
                                                                   onSelection,
                                                                   spinWheelSize,
                                                                   showConfetti,
                                                               }) => {
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
            {/* Confetti */}
            {showConfetti && configuration.enableConfetti && (
                <Confetti mode="fall" particleCount={500} shapeSize={20} />
            )}

            {/* Modal Content */}
            <div className="bg-gray-900 p-4 rounded-lg">
                <SpinningWheel
                    animes={selectedAnimes}
                    onClose={onClose}
                    onSelection={onSelection}
                    size={spinWheelSize}
                />
            </div>
        </div>
    );
};

export default React.memo(SpinningWheelModal);
