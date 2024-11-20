import React, { useRef, useState, useEffect } from 'react';
import configuration from '@/configuration';
import AnimeEntryModel from '@/app/models/AnimeEntry';

type UseWheelAnimationProps = {
    animes: AnimeEntryModel[];
    wheelRef: React.RefObject<SVGSVGElement>;
    onSelection: (anime: AnimeEntryModel | null) => void;
};

export default function useWheelAnimation({
                                              animes,
                                              wheelRef,
                                              onSelection,
                                          }: UseWheelAnimationProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState<AnimeEntryModel | null>(null);

    // Animation variables
    const animationRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const totalRotationRef = useRef<number>(0);
    const currentRotationRef = useRef<number>(0);
    const lastClickRotationRef = useRef<number>(0);

    // Sound refs
    const clickSoundRef = useRef<HTMLAudioElement>();
    const fanfareSoundRef = useRef<HTMLAudioElement>();

    useEffect(() => {
        // Initialize sounds
        clickSoundRef.current = new Audio('/click.mp3');
        clickSoundRef.current.volume = 0.5;

        fanfareSoundRef.current = new Audio('/fanfare.mp3');
        fanfareSoundRef.current.volume = 0.1;

        return () => {
            // Clean up on unmount
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        onSelection(selectedAnime);

        if (selectedAnime) {
            // Play fanfare sound
            if (fanfareSoundRef.current && configuration.playFanfare) {
                fanfareSoundRef.current.currentTime = 0;
                fanfareSoundRef.current.play();
            }
        } else {
            // Reset fanfare sound
            if (fanfareSoundRef.current && configuration.playFanfare) {
                fanfareSoundRef.current.pause();
                fanfareSoundRef.current.currentTime = 0;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAnime]);

    const playClickSound = () => {
        if (clickSoundRef.current && configuration.playClicks) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play();
        }
    };

    const animateWheel = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;

        const duration = 10000; // 10 seconds
        const progress = elapsed / duration;

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(Math.min(progress, 1));

        const rotation = easedProgress * totalRotationRef.current + currentRotationRef.current;

        // Update wheel rotation
        if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${rotation}deg)`;
        }

        // Play click sound when passing a pin
        const normalizedRotation = rotation % 360;
        const arrowOffset = 0; // Arrow is at top (0 degrees)
        const currentArrowRotation = (normalizedRotation + arrowOffset) % 360;
        const degreesPerPin = 360 / animes.length;

        // Calculate the pin position more precisely
        const currentPin = Math.floor(currentArrowRotation / degreesPerPin);
        const lastPin = Math.floor(lastClickRotationRef.current / degreesPerPin);

        if (currentPin !== lastPin) {
            playClickSound();
            lastClickRotationRef.current = currentArrowRotation;
        }

        if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateWheel);
        } else {
            cancelAnimationFrame(animationRef.current!);
            setIsSpinning(false);
            currentRotationRef.current = rotation % 360;

            // Determine selected anime
            const adjustedRotation = (360 - normalizedRotation) % 360;
            const segmentAngle = 360 / animes.length;
            const selectedIndex = Math.floor(adjustedRotation / segmentAngle) % animes.length;
            const selected = animes[selectedIndex];
            setSelectedAnime(selected);
        }
    };


    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setSelectedAnime(null);

        // Reset animation variables
        startTimeRef.current = undefined;
        totalRotationRef.current = Math.floor(Math.random() * 360) + 3600;
        currentRotationRef.current = 0;
        lastClickRotationRef.current = 0;

        animationRef.current = requestAnimationFrame(animateWheel);
    };

    return {
        isSpinning,
        selectedAnime,
        spinWheel,
    };
}
