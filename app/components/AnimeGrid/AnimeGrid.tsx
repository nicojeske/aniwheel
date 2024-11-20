import React, {useState} from "react";
import AnimeCard from "./AnimeCard";
import {MultipleSelectionModel} from "@/app/models/generic/MultipleSelectionModel";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {useTranslations} from "next-intl";
import {MultiSelect} from "@/app/components/AnimeGrid/Filter/MultiSelect";
import {RangeSlider} from "@/app/components/AnimeGrid/Filter/RangeSlider";
import Image from "next/image";

type AnimeGridProps = MultipleSelectionModel<AnimeEntryModel> & {
    wheelLimit?: number
}


const AnimeGrid: React.FC<AnimeGridProps> = ({models, selectedIds, onSelect, wheelLimit}) => {
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

    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [isCompactMode, setIsCompactMode] = useState(false);


    const filteredAnimes = models.filter((anime) => {
        const matchesSelected = !showSelectedOnly || selectedIds.includes(anime.id);
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
            matchesEpisodes && matchesScore && matchesStatus && matchesYear && matchesSelected;
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

    const handleSelectAll = () => {
        // If all items are already selected, deselect all, otherwise select all
        const allIds = filteredAnimes.map(anime => anime.id);
        const areAllSelected = filteredAnimes.every(anime => selectedIds.includes(anime.id));

        if (areAllSelected) {
            clearSelection();
        } else {
            for (const id of allIds) {
                onSelect(id);
            }
        }
    };

    const isFiltering = filteredAnimes.length !== models.length;
    // Number of selected animes not in the filtered list
    const selectedAnimesOutOfFiltered = selectedIds.filter(id => !filteredAnimes.map(anime => anime.id).includes(id)).length


    const CompactAnimeItem: React.FC<{
        anime: AnimeEntryModel,
        selected: boolean,
        onSelect: (id: number) => void
    }> = ({anime, selected, onSelect}) => (
        <div
            className={`p-2 rounded-md cursor-pointer transition-colors ${
                selected ? 'bg-blue-900/50 hover:bg-blue-800/50' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => onSelect(anime.id)}
        >
            <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                    <Image
                        src={anime.coverImageUrl}
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
                            <a
                                href={`https://anilist.co/anime/${anime.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors rounded-full hover:bg-blue-400/10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M6.361 2.943L0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422L6.361 2.943zm2.325 6.708l1.738 5.205H6.898l1.788-5.205z"/>
                                </svg>
                            </a>
                            {/* Modern Checkbox */}
                            <div
                                className="relative flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => onSelect(anime.id)}
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
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                        <span>{translateSeason(anime.season)} {anime.seasonYear}</span>
                        <span>•</span>
                        <span>{anime.episodeCount} {t('episodes')}</span>
                        <span>•</span>
                        <span>{anime.averageScore}% {t('average_score')}</span>
                    </div>
                </div>
            </div>
        </div>
    );


    return (
        <div className={"flex flex-grow flex-col gap-4"}>
            <div

            >
                {/* Search and Advanced Filters Toggle */}
                <div className="flex flex-col md:flex-row gap-4">
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

                <div
                    className="mt-4 mb-2 flex flex-wrap gap-4 items-center justify-between bg-gray-800 p-4 rounded-lg shadow-lg">
                    <div className="flex flex-wrap items-center gap-6">
                        {/* Total Animes Counter */}
                        <div className="flex items-center gap-2">
                            <div className="bg-gray-700 px-3 py-1 rounded-full">
                                <span className="text-gray-400 text-sm">{t('total')}</span>
                                <span className="ml-2 text-white font-semibold">{models.length}</span>
                            </div>
                        </div>

                        {/* Selected Animes Counter */}
                        <div className="flex items-center gap-2 cursor-pointer"
                             onClick={() => setShowSelectedOnly(!showSelectedOnly)}>
                            <div className={`px-3 py-1 rounded-full ${
                                showSelectedOnly ? 'bg-blue-900/50'
                                    : selectedIds.length > 0 ? 'bg-green-900/50'
                                        : 'bg-gray-700'
                            }`}>
                            <span className={`text-sm ${
                                showSelectedOnly ? 'text-blue-200'
                                    : selectedIds.length > 0 ? 'text-green-200'
                                        : 'text-gray-400'
                            }`}>{t('selected')}</span>
                                <span className="ml-2 text-white font-semibold">{selectedIds.length}</span>
                            </div>
                        </div>

                        {/* Filtered Animes Counter (only show if filtering) */}
                        {filteredAnimes.length !== models.length && (
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-900/50 px-3 py-1 rounded-full">
                                    <span className="text-blue-200 text-sm">{t('filtered')}</span>
                                    <span className="ml-2 text-white font-semibold">{filteredAnimes.length}</span>
                                </div>
                            </div>
                        )}


                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-3 flex-grow justify-end">
                        {/* View mode toggle */}
                        <button
                            onClick={() => setIsCompactMode(!isCompactMode)}
                            className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isCompactMode ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"/>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                )}
                            </svg>
                            {isCompactMode ? t('grid_view') : t('compact_view')}
                        </button>

                        <button
                            onClick={handleSelectAll}
                            className={`px-4 py-1.5 rounded-md transition-colors ${
                                filteredAnimes.length > 0
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={filteredAnimes.length === 0}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                </svg>
                                {filteredAnimes.every(anime => selectedIds.includes(anime.id))
                                    ? t('deselect_all')
                                    : t('select_all')
                                }
                            </div>
                        </button>

                        {selectedIds.length > 0 && (
                            <button
                                onClick={clearSelection}
                                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2"
                                disabled={selectedIds.length === 0}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                {t('clear_selection')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Reminder */}
                {isFiltering && selectedAnimesOutOfFiltered > 0 && selectedIds.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/40 rounded-md text-yellow-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {t('filter_reminder', {count: selectedAnimesOutOfFiltered})}
                        </div>
                    </div>
                )}

                {/* Limit Selections */}
                {wheelLimit && selectedIds.length > wheelLimit && (
                    <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/40 rounded-md text-yellow-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            {t('selection_disclaimer', {limit: wheelLimit})}
                        </div>
                    </div>
                )}</div>


            {/* Anime Grid/List */}
            {isCompactMode ? (
                <div
                    className="flex flex-col gap-2 p-0 md:p-4 bg-gray-900 text-white rounded-xl backdrop-blur-lg shadow-lg">
                    {filteredAnimes.map((anime) => (
                        <CompactAnimeItem
                            key={anime.id}
                            anime={anime}
                            selected={selectedIds.includes(anime.id)}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-0 md:p4 bg-gray-900 text-white rounded-xl backdrop-blur-lg shadow-lg">
                    {filteredAnimes.map((anime) => (
                        <AnimeCard
                            key={anime.id}
                            anime={anime}
                            selected={selectedIds.includes(anime.id)}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnimeGrid;
