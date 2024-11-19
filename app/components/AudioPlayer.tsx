import React, {useEffect, useRef, useState} from 'react';
import configuration from "@/configuration";

type AudioPlayerProps = {
    src: string;
    title?: string;
    autoplay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = (
    {
        src,
        title,
        autoplay = false
    }
) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(configuration.openingsDefaultVolume * 100);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const updateProgress = () => {
        const audio = audioRef.current;
        if (audio) {
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        }
    };

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = (parseFloat(e.target.value) / 100) * audio.duration;
            audio.currentTime = newTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        const newVolume = parseFloat(e.target.value);
        if (audio) {
            audio.volume = newVolume / 100;
        }
        setVolume(newVolume);
    };

    useEffect(() => {
        if (autoplay) {
            const audio = audioRef.current;
            if (audio) {
                audio.volume = volume / 100;
                audio.play().catch(() => {
                    // Autoplay might be blocked by the browser; log it or handle accordingly
                    setIsPlaying(false);
                });
            }
        }
    }, [autoplay]);

    return (
        <div className="flex flex-col  p-4 bg-gray-900 text-white rounded-lg shadow-lg max-w-md w-full">
            {/* Play/Pause and Progress Bar */}
            <div className="flex items-center gap-4">
                <div
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full cursor-pointer"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h2v12H9zM16 6h2v12h-2z"/>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.25 5.25v13.5L19.5 12 5.25 5.25z"
                            />
                        </svg>
                    )}
                </div>

                <div className="flex-1">
                    <p className="text font-medium truncate">{title || 'Audio Track'}</p>
                    <input
                        type="range"
                        value={progress}
                        onChange={onSeek}
                        className="w-full mt-2 accent-blue-600"
                    />
                </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium">Volume</div>
                <input
                    type="range"
                    value={volume}
                    min="0"
                    max="100"
                    onChange={changeVolume}
                    className="flex-1 accent-blue-600"
                />
            </div>

            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={updateProgress}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

export default AudioPlayer;