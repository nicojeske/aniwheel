import React, { useState } from "react";
import AnimeCard from "./AnimeCard";
import {MultipleSelectionModel} from "@/app/models/generic/MultipleSelectionModel";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {useTranslations} from "next-intl";

const AnimeGrid: React.FC<MultipleSelectionModel<AnimeEntryModel>> = ({models, selectedIds, onSelect}) => {
    const t = useTranslations('AnimeGrid');

    const [filterText, setFilterText] = useState<string>("");

    // Filter the animes based on the filterText
    const filteredAnimes = models.filter((anime) =>
        anime.title.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="p-4">
            {/* Filter Input */}
            <input
                type="text"
                placeholder={t('filter_placeholder')}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="mb-4 p-2 rounded-md bg-gray-800 text-white w-full"
            />

            {/* Anime Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-900 text-white rounded-xl backdrop-blur-lg shadow-lg">
                {filteredAnimes.map((anime) => (
                    <AnimeCard
                        key={anime.id}
                        id={anime.id}
                        title={anime.title}
                        coverImageUrl={anime.coverImageUrl}
                        selected={selectedIds.includes(anime.id)} // Check if the anime is selected
                        onSelect={onSelect} // Allow selecting/deselecting
                    />
                ))}
            </div>
        </div>
    );
};

export default AnimeGrid;
