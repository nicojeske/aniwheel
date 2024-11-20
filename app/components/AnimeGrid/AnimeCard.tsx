import React from "react";
import classNames from "classnames";
import Image from "next/image";
import {SelectableModel} from "@/app/models/generic/SelectableModel";
import AnimeEntryModel from "@/app/models/AnimeEntry";

export type AnimeCardModel = {
    anime: AnimeEntryModel;
}

type AnimeCardProps = SelectableModel<AnimeCardModel> & {
    showSelectionIndicator?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = (
    {
        anime,
        selected,
        onSelect,
        showSelectionIndicator = true
    }) => {
    return (
        <div
            className={classNames(
                "relative group p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-300 min-w-full",
                "hover:transform hover:scale-[1.02] hover:shadow-xl",
                selected
                    ? "bg-blue-900/40 ring-2 ring-blue-500"
                    : "bg-gray-800/40 hover:bg-gray-800/60"
            )}
            onClick={() => onSelect(anime.id)}
            style={{maxWidth: "300px"}}
        >
            {/* Cover Image Container */}
            <div className="relative overflow-hidden rounded-lg">
                {/* Anilist Button */}
                {anime.id !== -1 && (
                    <a
                        href={`https://anilist.co/anime/${anime.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={classNames(
                            "absolute top-2 right-2 z-10 p-2 rounded-full",
                            "bg-black/50 backdrop-blur-sm transition-all duration-300",
                            "hover:bg-blue-500/80 group-hover:opacity-100",
                            "opacity-0 hover:scale-110"
                        )}
                    >
                        <svg
                            className="w-4 h-4 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M6.361 2.943L0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422L6.361 2.943zm2.325 6.708l1.738 5.205H6.898l1.788-5.205z"/>
                        </svg>
                    </a>
                )}

                {/* Selection Indicator */}
                {showSelectionIndicator && (
                    <div
                        className={classNames(
                            "absolute top-2 left-2 z-10 transition-all duration-300",
                            "opacity-0 group-hover:opacity-100",
                            selected && "opacity-100"
                        )}
                    >
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => onSelect(anime.id)}
                                className={classNames(
                                    "appearance-none w-5 h-5 rounded-md transition-all duration-300",
                                    "border-2 cursor-pointer",
                                    selected
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-400 bg-black/50 backdrop-blur-sm"
                                )}
                            />
                            <svg
                                className={classNames(
                                    "absolute inset-0 w-5 h-5 pointer-events-none text-white p-1",
                                    "transition-opacity duration-300",
                                    selected ? "opacity-100" : "opacity-0"
                                )}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Image with Overlay */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                    <Image
                        src={anime.coverImageUrl}
                        alt={anime.title}
                        fill
                        sizes="(max-width: 300px) 100vw, 300px"
                        className={classNames(
                            "object-cover transition-transform duration-300",
                            "group-hover:scale-105"
                        )}
                        priority={false}
                    />
                    {/* Gradient Overlay */}
                    <div className={classNames(
                        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    )}/>
                </div>
            </div>

            {/* Title */}
            <h3 className={classNames(
                "mt-4 text-center font-medium transition-colors duration-300",
                "line-clamp-2 text-sm leading-tight",
                selected ? "text-white" : "text-gray-200"
            )}>
                {anime.title}
            </h3>

            {/* Anime Info */}
            <div className={classNames(
                "mt-2 flex justify-center gap-2 text-xs text-gray-400",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )}>
                <span>{anime.seasonYear}</span>
                <span>•</span>
                <span>{anime.episodeCount} ep</span>
                <span>•</span>
                <span>{anime.averageScore}%</span>
            </div>
        </div>
    );
};

export default AnimeCard;
