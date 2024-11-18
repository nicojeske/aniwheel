import React, {useState, useRef, useEffect} from 'react';
import AnimeCard from "@/app/components/AnimeCard";
import AnimeEntryModel from "@/app/models/AnimeEntry";

type SpinningWheelProps = {
    animes: AnimeEntryModel[];
    onClose: () => void;
    size?: number;
    onSelection?: (anime: AnimeEntryModel | null) => void;
}

export default function SpinningWheel({animes, onClose, size = 400, onSelection = (_ => {})}: SpinningWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const wheelRef = useRef(null);
    const clickSoundRef = useRef(null);
    const famfareSoundRef = useRef(null);

    // Variables for animation
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const totalRotationRef = useRef(0);
    const currentRotationRef = useRef(0);
    const lastClickTimeRef = useRef(0);
    const lastClickRotationRef = useRef(0);

    // Set radius based on the size prop
    const radius = size / 2;

    // Function to play click sound
    const playClickSound = () => {
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play();
        }
    };

    useEffect(() => {
        onSelection(selectedAnime);

        if (selectedAnime) {
            // Play fanfare sound
            if (famfareSoundRef.current) {
                famfareSoundRef.current.currentTime = 0;
                famfareSoundRef.current.play();
            }
        } else {
            // Reset fanfare sound
            if (famfareSoundRef.current) {
                famfareSoundRef.current.pause();
                famfareSoundRef.current.currentTime = 0;
            }
        }

    }, [selectedAnime])

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setSelectedAnime(null);

        // Reset variables
        startTimeRef.current = null;
        totalRotationRef.current = Math.floor(Math.random() * 360) + 3600; // At least 10 full rotations
        currentRotationRef.current = 0;
        lastClickTimeRef.current = 0;
        lastClickRotationRef.current = 0;

        // Start animation
        animationRef.current = requestAnimationFrame(animateWheel);
    };

    const animateWheel = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;

        // Spin duration in milliseconds
        const duration = 10000;
        const progress = elapsed / duration;

        // Ease-out effect using easeOutCubic function
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(Math.min(progress, 1));

        // Calculate current rotation
        const rotation = easedProgress * totalRotationRef.current + currentRotationRef.current;

        // Update wheel rotation
        wheelRef.current.style.transform = `rotate(${rotation}deg)`;

        // --- Adjust for the pin clicks that align with the arrow at 90 degrees ---
        // Calculate the normalized rotation (0-360 degrees)
        const normalizedRotation = rotation % 360;
        const arrowOffset = 90; // The arrow is at 90 degrees in the SVG system

        // Find rotation relative to arrow position (top)
        const currentArrowRotation = (normalizedRotation + arrowOffset) % 360;

        // Check the distance from the last pin click and play sound when rotating past a pin
        const degreesPerPin = 360 / animes.length;
        const rotationSinceLastClick = currentArrowRotation - lastClickRotationRef.current;

        if (rotationSinceLastClick >= degreesPerPin || rotationSinceLastClick < 0) {
            playClickSound();
            lastClickRotationRef.current = currentArrowRotation;
        }

        if (progress < 1) {
            // Continue animation
            animationRef.current = requestAnimationFrame(animateWheel);
        } else {
            // Animation finished
            cancelAnimationFrame(animationRef.current);
            setIsSpinning(false);
            currentRotationRef.current = rotation % 360;

            // Determine selected anime - same selector logic
            // const adjustedRotation = (360 - (normalizedRotation + arrowOffset)) % 360;
            // Calculate adjusted rotation to ensure it is non-negative
            const adjustedRotation = ((360 - (normalizedRotation + arrowOffset)) + 360) % 360;

            const segmentAngle = 360 / animes.length;
            const selectedIndex = Math.floor(adjustedRotation / segmentAngle) % animes.length;
            const selected = animes[selectedIndex];
            setSelectedAnime(selected);
        }
    };

    useEffect(() => {
        return () => {
            // Clean up on unmount
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        // Initialize click sound
        clickSoundRef.current = new Audio('/click.mp3');
        clickSoundRef.current.volume = 0.5; // Adjust volume as needed

        // Initialize fanfare sound
        famfareSoundRef.current = new Audio('/fanfare.mp3');
        famfareSoundRef.current.volume = 0.1; // Adjust volume as needed
    }, []);

    return (
        <div className="relative flex flex-row items-center text-white gap-10">
            {/* Wheel Container */}
            <div className="relative">
                {/* Wheel */}
                <div className="relative">
                    <svg
                        ref={wheelRef}
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        className="transform rounded-full"
                    >
                        {/* Wheel Segments */}
                        {animes.map((anime, index) => {
                            const segmentAngle = 360 / animes.length;
                            const startAngle = index * segmentAngle;
                            const endAngle = startAngle + segmentAngle;
                            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                            const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
                            const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
                            const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180);
                            const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180);

                            const pathData = `
                                M ${radius} ${radius}
                                L ${x1} ${y1}
                                A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                                Z
                            `;
                            const fillColor = `hsl(${(index * 360) / animes.length}, 70%, 60%)`;

                            // Calculate text position
                            const midAngle = startAngle + segmentAngle / 2;
                            const midAngleRad = (Math.PI * midAngle) / 180;
                            const textRadius = radius * 0.5;
                            const textX = radius + textRadius * Math.cos(midAngleRad);
                            const textY = radius + textRadius * Math.sin(midAngleRad);

                            return (
                                <g key={index}>
                                    <path
                                        d={pathData}
                                        fill={fillColor}
                                        stroke="#ffffff"
                                        strokeWidth="1"
                                    />
                                    {/* Anime Title */}
                                    <text
                                        x={textX}
                                        y={textY}
                                        fill="#000000"
                                        fontSize={size * 0.03} // Make font size a fraction of wheel size
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        transform={`rotate(${midAngle} ${textX} ${textY})`}
                                    >
                                        <tspan
                                            x={textX}
                                            y={textY}
                                            transform={`rotate(${-midAngle} ${textX} ${textY})`}
                                        >
                                            {anime.title}
                                        </tspan>
                                    </text>
                                </g>
                            );
                        })}

                        {/* Pins */}
                        {animes.map((_, index) => {
                            const angle = (index * 360) / animes.length;
                            const pinLength = size * 0.04; // Scale pin length relative to wheel size
                            const pinRadius = size * 0.01; // Scale pin radius relative to wheel size
                            const x = radius + (radius - pinLength) * Math.cos((Math.PI * angle) / 180);
                            const y = radius + (radius - pinLength) * Math.sin((Math.PI * angle) / 180);
                            return (
                                <circle
                                    key={`pin-${index}`}
                                    cx={x}
                                    cy={y}
                                    r={pinRadius}
                                    fill="#555555"
                                    stroke="#ffffff"
                                    strokeWidth="1"
                                />
                            );
                        })}
                    </svg>

                    {/* Fixed Indicator Arrow */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                        <svg width={size * 0.1} height={size * 0.1} viewBox="0 0 100 100">
                            <polygon
                                points="50,0 90,80 10,80"
                                fill="#ff0000"
                                stroke="#ffffff"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div>
                {/* Display Selected Anime */}

                <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold">Das heilige Rad sagt:</h3>
                    {selectedAnime ? (
                        <AnimeCard coverImageUrl={selectedAnime.coverImageUrl} selected={true}
                                   title={selectedAnime.title} id={selectedAnime.id} onSelect={(_) => {
                        }}></AnimeCard>
                    ) : (
                        <AnimeCard coverImageUrl={"/cover.webp"} selected={true}
                                   title={"???"} id={0} onSelect={(_) => {
                        }}></AnimeCard>
                    )}
                </div>


                <div
                    className="flex items-center justify-center flex-row mt-4 gap-4"
                >
                    {/* Spin Button */}
                    <button
                        onClick={spinWheel}
                        className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 w-3/4"
                        disabled={isSpinning}
                    >
                        {isSpinning ? 'Dreht...' : 'Drehen'}
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
