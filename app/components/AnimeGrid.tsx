import React, { useState } from "react";
import AnimeCard from "./AnimeCard";
import AnimeEntryModel from "@/app/models/AnimeEntry";

type AnimeGridProps = {
    animes: AnimeEntryModel[];
    selectedAnimeIds: number[]; // Accept selectedAnimeIds prop
    onSelect: (id: number) => void; // Accept onSelect handler prop
};


const AnimeGrid: React.FC<AnimeGridProps> = ({ animes, selectedAnimeIds, onSelect }) => {


    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-900 text-white rounded-xl backdrop-blur-lg shadow-lg w-full">
            {animes.map((anime) => (
                <AnimeCard
                    key={anime.id}
                    id={anime.id}
                    title={anime.title}
                    coverImageUrl={anime.coverImageUrl}
                    selected={selectedAnimeIds.includes(anime.id)} // Check if the anime is selected
                    onSelect={onSelect} // Allow selecting/deselecting
                />
            ))}
        </div>
    );
};

export default AnimeGrid;
