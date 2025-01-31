import {useState} from 'react';
import {Dispatch, SetStateAction} from "react";
import {MediaSeason, MediaStatus} from "@/app/gql/graphql";
import AnimeEntryModel from "@/app/models/AnimeEntry";

export interface FilterStates {
    episodeRange: [number, number];
    filterText: string;
    scoreRange: [number, number];
    selectedGenres: string[];
    selectedSeasons: string[];
    selectedStatus: string[];
    selectedYears: number[];
    setEpisodeRange: Dispatch<SetStateAction<[number, number]>>;
    setFilterText: Dispatch<SetStateAction<string>>;
    setScoreRange: Dispatch<SetStateAction<[number, number]>>;
    setSelectedGenres: Dispatch<SetStateAction<string[]>>;
    setSelectedSeasons: Dispatch<SetStateAction<string[]>>;
    setSelectedStatus: Dispatch<SetStateAction<string[]>>;
    setSelectedYears: Dispatch<SetStateAction<number[]>>;
    setShowSelectedOnly: Dispatch<SetStateAction<boolean>>;
    showSelectedOnly: boolean;
}

export interface UniqueOptions {
    episodeCounts: number[];
    genres: string[];
    scores: number[];
    seasons: MediaSeason[];
    statuses: MediaStatus[];
    years: number[];
}

export type AnimeFilterResult = {
    uniqueOptions: UniqueOptions;
    filterStates: FilterStates;
    filterAnimes: (models: AnimeEntryModel[], selectedIds: number[]) => AnimeEntryModel[];
    selectedAnimesOutOfFiltered: number;
}

const notYetReleasedState = "NOT_YET_RELEASED";

export const useAnimeFilters = (models: AnimeEntryModel[], selectedIds: number[]): AnimeFilterResult => {
    // Extract unique filter options
    const uniqueOptions = {
        genres: [...new Set(models.flatMap((anime) => anime.genres))],
        seasons: [...new Set(models.flatMap((anime) => anime.season))],
        years: [...new Set(models.flatMap((anime) => anime.seasonYear))],
        episodeCounts: [...new Set(models.flatMap((anime) => anime.episodeCount))],
        statuses: [...new Set(models.flatMap((anime) => anime.status))],
        scores: [...new Set(models.flatMap((anime) => anime.averageScore))]
    };

    // Filter states
    const [filterText, setFilterText] = useState<string>("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
    const [episodeRange, setEpisodeRange] = useState<[number, number]>([
        Math.min(...uniqueOptions.episodeCounts),
        Math.max(...uniqueOptions.episodeCounts)
    ]);
    const [scoreRange, setScoreRange] = useState<[number, number]>([
        Math.min(...uniqueOptions.scores),
        Math.max(...uniqueOptions.scores)
    ]);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<number[]>([]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    // Enable all statuses except NOT_YET_RELEASED
    const allStatuses = uniqueOptions.statuses.filter(status => status !== notYetReleasedState);
    if (
        selectedStatus.length === 0 &&
        allStatuses.length > 0 &&
        uniqueOptions.statuses.includes(MediaStatus.NotYetReleased)
    ) {
        setSelectedStatus(allStatuses);
    }

    // Filtering logic
    const filterAnimes = (
        models: AnimeEntryModel[],
        selectedIds: number[]
    ) => {
        return models.filter((anime) => {
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
                matchesEpisodes && matchesScore && matchesStatus &&
                matchesYear && matchesSelected;
        });
    };

    // Count selected animes that are not in the filtered list
    const selectedAnimesOutOfFiltered = selectedIds.filter(id => !filterAnimes(models, selectedIds).map(anime => anime.id).includes(id)).length

    return {
        uniqueOptions,
        filterStates: {
            filterText, setFilterText,
            selectedGenres, setSelectedGenres,
            selectedSeasons, setSelectedSeasons,
            episodeRange, setEpisodeRange,
            scoreRange, setScoreRange,
            selectedStatus, setSelectedStatus,
            selectedYears, setSelectedYears,
            showSelectedOnly, setShowSelectedOnly
        },
        filterAnimes,
        selectedAnimesOutOfFiltered
    };
};