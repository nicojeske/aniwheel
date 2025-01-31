import React from "react";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import Image from "next/image";

function convertSeasonToString(season: string): string {
    switch (season.toUpperCase()) {
        case "WINTER":
            return "Winter";
        case "SPRING":
            return "Spring";
        case "SUMMER":
            return "Summer";
        case "FALL":
            return "Fall";
        default:
            return season;
    }
}

export const CompactAnimeItem: React.FC<{
    anime: AnimeEntryModel,
    selected: boolean,
    onSelect: (id: number) => void,
}> = ({anime, selected, onSelect}) => {

    return (
        <div
            className={`p-2 rounded-md cursor-pointer transition-colors ${
                selected ? 'bg-blue-900/50 hover:bg-blue-800/50' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => onSelect(anime.id)}
        >
            <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                    <Image
                        src={anime.coverImageUrlMedium}
                        alt={anime.title}
                        width={40}
                        height={60}
                        className="rounded-sm object-cover"
                        priority={false}
                    />
                </div>
                <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm truncate">{anime.title}</span>
                        <div className="flex items-center gap-2">
                            {/* Anilist Button */}
                            <AnilistButton id={anime.id} onClick={(e) => e.stopPropagation()}/>

                            {/* Checkbox */}
                            <Checkbox onClick={(e) => e.stopPropagation()} checked={selected}
                                      onChange={() => onSelect(anime.id)}/>
                        </div>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                        <span>{convertSeasonToString(anime.season)} {anime.seasonYear}</span>
                        <span>•</span>
                        <span>{anime.episodeCount} Episodes</span>
                        <span>•</span>
                        <span>{anime.averageScore}% Average score</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnilistButton(props: { id: number, onClick: (e: React.MouseEvent<HTMLElement>) => void }) {
    return <a
        href={`https://anilist.co/anime/${props.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors rounded-full hover:bg-blue-400/10"
        onClick={props.onClick}
    >
        <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path
                d="M6.361 2.943L0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422L6.361 2.943zm2.325 6.708l1.738 5.205H6.898l1.788-5.205z"/>
        </svg>
    </a>;
}

function Checkbox(props: { onClick: (e: React.MouseEvent<HTMLElement>) => void, checked: boolean, onChange: () => void }) {
    return <div
        className="relative flex items-center justify-center"
        onClick={props.onClick}
    >
        <input
            type="checkbox"
            checked={props.checked}
            onChange={props.onChange}
            className="peer appearance-none w-5 h-5 border-2 border-gray-500 rounded-md
checked:border-blue-500 checked:bg-blue-500 transition-colors
cursor-pointer"
        />
        <svg
            className="absolute w-3.5 h-3.5 pointer-events-none text-white
opacity-0 peer-checked:opacity-100 transition-opacity"
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
    </div>;
}