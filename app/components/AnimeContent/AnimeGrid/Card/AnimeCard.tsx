import React from "react";
import classNames from "classnames";
import {SelectableModel} from "@/app/models/generic/SelectableModel";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import AnilistButton from "@/app/components/AnimeContent/AnimeGrid/Card/components/AnilistButton";
import SelectionIndicator from "@/app/components/AnimeContent/AnimeGrid/Card/components/SelectionIndicator";
import AnimeImage from "@/app/components/AnimeContent/AnimeGrid/Card/components/AnimeImage";
import AnimeTitle from "@/app/components/AnimeContent/AnimeGrid/Card/components/AnimeTitle";
import AnimeInfo from "@/app/components/AnimeContent/AnimeGrid/Card/components/AnimeInfo";

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
                    <AnilistButton id={anime.id} onClick={(e) => e.stopPropagation()}/>
                )}

                {/* Selection Indicator */}
                {showSelectionIndicator && (
                    <SelectionIndicator selected={selected} onChange={() => onSelect(anime.id)}/>
                )}

                {/* Image with Overlay */}
                <AnimeImage src={anime.coverImageUrlLarge} alt={anime.title}/>
            </div>

            {/* Title */}
            <AnimeTitle selected={selected} title={anime.title}/>

            {/* Anime Info */}
            <AnimeInfo seasonYear={anime.seasonYear}
                       episodeCount={anime.episodeCount}
                       averageScore={anime.averageScore}/>
        </div>
    );
};

export default AnimeCard;
