import React, {useState} from "react";
import AnimeCard from "./AnimeCard";
import {MultipleSelectionModel} from "@/app/models/generic/MultipleSelectionModel";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {useTranslations} from "next-intl";
import {MultiSelect} from "@/app/components/AnimeGrid/Filter/MultiSelect";
import {RangeSlider} from "@/app/components/AnimeGrid/Filter/RangeSlider";

const AnimeGrid: React.FC<MultipleSelectionModel<AnimeEntryModel>> = ({models, selectedIds, onSelect}) => {
    const t = useTranslations('AnimeGrid');

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const allUniqueGenres = [...new Set(models.flatMap((anime) => anime.genres))];
    const allUniqueSeasons = [...new Set(models.flatMap((anime) => anime.season))];
    const allUniqueSeasonYears = [...new Set(models.flatMap((anime) => anime.seasonYear))];
    const allUniqueEpisodeCounts = [...new Set(models.flatMap((anime) => anime.episodeCount))];
    const allUniqueStatuses = [...new Set(models.flatMap((anime) => anime.status))];
    const allUniqueAverageScores = [...new Set(models.flatMap((anime) => anime.averageScore))];


    const [filterText, setFilterText] = useState<string>("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
    const [episodeRange, setEpisodeRange] = useState<[number, number]>([Math.min(...allUniqueEpisodeCounts), Math.max(...allUniqueEpisodeCounts)]);
    const [scoreRange, setScoreRange] = useState<[number, number]>([Math.min(...allUniqueAverageScores), Math.max(...allUniqueAverageScores)]);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedYears, setselectedYears] = useState<number[]>([]);


    const filteredAnimes = models.filter((anime) => {
        const matchesText = anime.title.toLowerCase().includes(filterText.toLowerCase());
        const matchesGenres = selectedGenres.length === 0 ||
            selectedGenres.every(genre => anime.genres.includes(genre));
        const matchesSeasons = selectedSeasons.length === 0 ||
            selectedSeasons.includes(anime.season);
        const matchesEpisodes = anime.episodeCount >= episodeRange[0] &&
            anime.episodeCount <= episodeRange[1];
        const matchesScore = anime.averageScore >= scoreRange[0] &&
            anime.averageScore <= scoreRange[1];
        const matchesStatus = selectedStatus.length === 0 ||
            selectedStatus.includes(anime.status);
        const matchesYear = selectedYears.length === 0 ||
            selectedYears.includes(anime.seasonYear);

        return matchesText && matchesGenres && matchesSeasons &&
            matchesEpisodes && matchesScore && matchesStatus && matchesYear;
    });

    const translateSeason = (season: string) => {
        // @ts-expect-error Use enum values as translation keys
        return t(`season_${season.toLowerCase()}`);
    }

    const translateStatus = (status: string) => {
        // @ts-expect-error Use enum values as translation keys
        return t(`status_${status.toLowerCase()}`);
    }

    const clearSelection = () => {
        for (const id of selectedIds) {
            onSelect(id);
        }
    }

    const isFiltering = filteredAnimes.length !== models.length;
    // Number of selected animes not in the filtered list
    const selectedAnimesOutOfFiltered = selectedIds.filter(id => !filteredAnimes.map(anime => anime.id).includes(id)).length

    return (
        <div className="p-4">

            {/* Search and Advanced Filters Toggle */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder={t('filter_placeholder')}
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="flex-1 p-2 rounded-md bg-gray-800 text-white"
                />
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <svg
                        className={`w-5 h-5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                    {t('advanced_filters')}
                </button>
            </div>

            {/* Advanced Filters Section */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showAdvancedFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-900 rounded-xl">
                    {/* Genre Filter */}
                    <MultiSelect<string>
                        options={allUniqueGenres}
                        selectedValues={selectedGenres}
                        onChange={setSelectedGenres}
                        label={t('genres')}
                        placeholder={t('select_genres')}
                        searchable={true}
                    />

                    {/* Season Filter */}
                    <MultiSelect<string>
                        options={allUniqueSeasons}
                        selectedValues={selectedSeasons}
                        onChange={setSelectedSeasons}
                        getOptionLabel={translateSeason}
                        label={t('seasons')}
                        placeholder={t('select_seasons')}
                        searchable={false}
                    />

                    {/* Year Filter */}
                    <MultiSelect<number>
                        options={allUniqueSeasonYears.sort((a, b) => b - a)} // Sort years descending
                        selectedValues={selectedYears}
                        onChange={setselectedYears}
                        label={t('year')}
                        placeholder={t('select_year')}
                        searchable={true}
                    />

                    {/* Status Filter */}
                    <MultiSelect<string>
                        options={allUniqueStatuses}
                        selectedValues={selectedStatus}
                        onChange={setSelectedStatus}
                        getOptionLabel={translateStatus}
                        label={t('status')}
                        placeholder={t('select_status')}
                    />

                    {/* Episode Count Range */}
                    <RangeSlider
                        min={Math.min(...allUniqueEpisodeCounts)}
                        max={Math.max(...allUniqueEpisodeCounts)}
                        value={episodeRange}
                        onChange={setEpisodeRange}
                        label={t('episode_count')}
                    />

                    {/* Score Range */}
                    <RangeSlider
                        min={Math.min(...allUniqueAverageScores)}
                        max={Math.max(...allUniqueAverageScores)}
                        value={scoreRange}
                        onChange={setScoreRange}
                        label={t('average_score')}
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="mt-4 mb-2 flex justify-between items-center text-white">
                <div className="flex gap-4">
                    <span>{t('total_animes', { count: models.length })}</span>
                    <span>{t('selected_animes', { count: selectedIds.length })}</span>
                </div>
                {selectedIds.length > 0 && (
                    <button
                        onClick={clearSelection} // Clear all selections
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        {t('clear_selection')}
                    </button>
                )}
            </div>

            {/* Filter Reminder */}
            {isFiltering && selectedAnimesOutOfFiltered > 0 && selectedIds.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/40 rounded-md text-yellow-200">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('filter_reminder', { count: selectedAnimesOutOfFiltered})}
                    </div>
                </div>
            )}


            {/* Anime Grid */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-900 text-white rounded-xl backdrop-blur-lg shadow-lg">
                {filteredAnimes.map((anime) => (
                    <AnimeCard
                        key={anime.id}
                        id={anime.id}
                        title={anime.title}
                        coverImageUrl={anime.coverImageUrl}
                        selected={selectedIds.includes(anime.id)}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default AnimeGrid;
