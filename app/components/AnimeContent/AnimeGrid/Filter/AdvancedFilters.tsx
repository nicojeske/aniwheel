import React from 'react';
import {useTranslations} from "next-intl";
import {FilterStates, UniqueOptions} from "@/app/hooks/useAnimeFilter";
import {MultiSelect} from "@/app/components/AnimeContent/AnimeGrid/Filter/MultiSelect";
import {RangeSlider} from "@/app/components/AnimeContent/AnimeGrid/Filter/RangeSlider";

interface AdvancedFiltersProps {
    shown: boolean;
    filterStates: FilterStates;
    uniqueOptions: UniqueOptions;
}

export const AdvancedFilters = ({shown, filterStates, uniqueOptions}: AdvancedFiltersProps) => {
    const t = useTranslations('AnimeGrid');

    const translateSeason = (season: string) => {
        // @ts-expect-error Use enum values as translation keys
        return t(`season_${season.toLowerCase()}`);
    }

    const translateStatus = (status: string) => {
        // @ts-expect-error Use enum values as translation keys
        return t(`status_${status.toLowerCase()}`);
    }

    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            shown ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-900 rounded-xl">
                {/* Genre Filter */}
                <MultiSelect<string>
                    options={uniqueOptions.genres}
                    selectedValues={filterStates.selectedGenres}
                    onChange={filterStates.setSelectedGenres}
                    label={t('genres')}
                    placeholder={t('select_genres')}
                    searchable={true}
                />

                {/* Season Filter */}
                <MultiSelect<string>
                    options={uniqueOptions.seasons}
                    selectedValues={filterStates.selectedSeasons}
                    onChange={filterStates.setSelectedSeasons}
                    getOptionLabel={translateSeason}
                    label={t('seasons')}
                    placeholder={t('select_seasons')}
                    searchable={false}
                />

                {/* Year Filter */}
                <MultiSelect<number>
                    options={uniqueOptions.years.sort((a, b) => b - a)}
                    selectedValues={filterStates.selectedYears}
                    onChange={filterStates.setSelectedYears}
                    label={t('year')}
                    placeholder={t('select_year')}
                    searchable={true}
                />

                {/* Status Filter */}
                <MultiSelect<string>
                    options={uniqueOptions.statuses}
                    selectedValues={filterStates.selectedStatus}
                    onChange={filterStates.setSelectedStatus}
                    getOptionLabel={translateStatus}
                    label={t('status')}
                    placeholder={t('select_status')}
                />

                {/* Episode Count Range */}
                <RangeSlider
                    min={Math.min(...uniqueOptions.episodeCounts)}
                    max={Math.max(...uniqueOptions.episodeCounts)}
                    value={filterStates.episodeRange}
                    onChange={filterStates.setEpisodeRange}
                    label={t('episode_count')}
                />

                {/* Score Range */}
                <RangeSlider
                    min={Math.min(...uniqueOptions.scores)}
                    max={Math.max(...uniqueOptions.scores)}
                    value={filterStates.scoreRange}
                    onChange={filterStates.setScoreRange}
                    label={t('average_score')}
                />
            </div>
        </div>
    );
};
