import React, {useEffect, useRef, useState} from 'react';
import configuration from "@/configuration";
import classNames from 'classnames';

type AudioPlayerProps = {
    src: string;
    title?: string;
    autoplay?: boolean;
    onPlayStateChange?: (isPlaying: boolean) => void;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
                                                     src,
                                                     title,
                                                     autoplay = false,
                                                     onPlayStateChange
                                                 }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(configuration.openingsDefaultVolume * 100);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const togglePlayPause = () => {
        if (isLoading) return;

        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
            onPlayStateChange?.(!isPlaying);
        }
    };

    const updateProgress = () => {
        const audio = audioRef.current;
        if (audio) {
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
            setCurrentTime(audio.currentTime);
        }
    };

    const onProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        const progressBar = progressRef.current;

        if (audio && progressBar) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * audio.duration;

            audio.currentTime = newTime;
            setProgress(percent * 100);
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        const newVolume = parseFloat(e.target.value);
        if (audio) {
            audio.volume = newVolume / 100;
            setVolume(newVolume);
            if (newVolume === 0) {
                setIsMuted(true);
            } else if (isMuted) {
                setIsMuted(false);
            }
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume / 100;

            const onLoadedData = () => {
                setDuration(audio.duration);
                setIsLoading(false);
            };

            audio.addEventListener('loadeddata', onLoadedData);

            if (autoplay) {
                audio.play().catch(() => {
                    setIsPlaying(false);
                    setIsLoading(false);
                });
            }

            return () => {
                audio.removeEventListener('loadeddata', onLoadedData);
            };
        }
    }, [autoplay, volume]);


    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                togglePlayPause();
            } else if (e.code === 'KeyM' && e.target === document.body) {
                e.preventDefault();
                toggleMute();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [togglePlayPause, toggleMute]);

    return (
        <div
            className="flex flex-col p-4 bg-gray-900/80 backdrop-blur-lg text-white rounded-xl shadow-xl max-w-md w-full">
            {/* Title and Duration */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium truncate flex-1">{title || 'Audio Track'}</h3>
                <span className="text-sm text-gray-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>

            {/* Progress Bar */}
            <div
                ref={progressRef}
                className="relative h-1.5 bg-gray-700 rounded-full cursor-pointer mb-4 group"
                onClick={onProgressBarClick}
            >
                <div
                    className="absolute h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                />
                <div
                    className={classNames(
                        "absolute h-3 w-3 bg-white rounded-full transition-all -translate-x-1/2",
                        "top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100",
                        isPlaying && "opacity-100"
                    )}
                    style={{ left: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className={classNames(
                        "w-12 h-12 flex items-center justify-center rounded-full transition-all",
                        isLoading
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    )}
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"
                                    fill="none"/>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12z"/>
                        </svg>
                    ) : isPlaying ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 6h2v12H9zM16 6h2v12h-2z"/>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M5.25 5.25v13.5L19.5 12 5.25 5.25z"/>
                        </svg>
                    )}
                </button>

                {/* Volume Control */}
                <div className="relative">
                    <button
                        className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMuted || volume === 0 ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m-2 2l-2-2m2 2l2 2m-2-2l-2 2"
                                />
                            ) : volume < 50 ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M15.536 8.464a5 5 0 010 7.072"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17.657 16.657a8 8 0 000-11.314"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Updated Volume Slider positioning and behavior */}
                    {showVolumeSlider && (
                        <div
                            className={classNames(
                                "absolute left-full ml-2 top-1/2 -translate-y-1/2",
                                "bg-gray-800 rounded-lg shadow-lg p-2",
                                "flex items-center gap-3",
                                "z-50"
                            )}
                        >
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={changeVolume}
                                className="w-24 h-1.5 appearance-none bg-gray-700 rounded-full"
                                style={{
                                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${volume}%, rgb(55 65 81) ${volume}%, rgb(55 65 81) 100%)`
                                }}
                            />
                            <span className="text-xs text-gray-400 min-w-[2.5rem] text-center">
                                {Math.round(volume)}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Time Display - Mobile */}
                <div className="text-sm text-gray-400 md:hidden">
                    {formatTime(currentTime)}
                </div>
            </div>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={updateProgress}
                onEnded={() => {
                    setIsPlaying(false);
                    onPlayStateChange?.(false);
                }}
                onPlay={() => {
                    setIsPlaying(true);
                    onPlayStateChange?.(true);
                }}
                onPause={() => {
                    setIsPlaying(false);
                    onPlayStateChange?.(false);
                }}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
            />

            {/* Keyboard Controls */}
            <div className="hidden">
                <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">Space</kbd>
                <span className="text-xs text-gray-400 ml-2">Play/Pause</span>
                <kbd className="px-2 py-1 text-xs bg-gray-700 rounded ml-4">M</kbd>
                <span className="text-xs text-gray-400 ml-2">Mute/Unmute</span>
            </div>
        </div>
    );
};


export default AudioPlayer;

