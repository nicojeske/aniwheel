import React from 'react';
import {FilterStates, UniqueOptions} from "@/app/hooks/useAnimeFilter";
import {MultiSelect} from "@/app/components/AnimeContent/AnimeGrid/Filter/MultiSelect";
import {RangeSlider} from "@/app/components/AnimeContent/AnimeGrid/Filter/RangeSlider";

interface AdvancedFiltersProps {
    shown: boolean;
    filterStates: FilterStates;
    uniqueOptions: UniqueOptions;
}

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

function convertStatusToString(status: string): string {
    switch (status.toUpperCase()) {
        case "FINISHED":
            return "Finished";
        case "RELEASING":
            return "Releasing";
        case "NOT_YET_RELEASED":
            return "Not Yet Released";
        case "CANCELLED":
            return "Cancelled";
        default:
            return status;
    }
}


export const AdvancedFilters = ({shown, filterStates, uniqueOptions}: AdvancedFiltersProps) => {

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
                    label="Genre"
                    placeholder="Select genres"
                    searchable={true}
                />

                {/* Season Filter */}
                <MultiSelect<string>
                    options={uniqueOptions.seasons}
                    selectedValues={filterStates.selectedSeasons}
                    onChange={filterStates.setSelectedSeasons}
                    getOptionLabel={convertSeasonToString}
                    label="Season"
                    placeholder="Select seasons"
                    searchable={false}
                />

                {/* Year Filter */}
                <MultiSelect<number>
                    options={uniqueOptions.years.sort((a, b) => b - a)}
                    selectedValues={filterStates.selectedYears}
                    onChange={filterStates.setSelectedYears}
                    label="Year"
                    placeholder="Select years"
                    searchable={true}
                />

                {/* Status Filter */}
                <MultiSelect<string>
                    options={uniqueOptions.statuses}
                    selectedValues={filterStates.selectedStatus}
                    onChange={filterStates.setSelectedStatus}
                    getOptionLabel={convertStatusToString}
                    label="Media Status"
                    placeholder="Select status"
                />

                {/* Episode Count Range */}
                <RangeSlider
                    min={Math.min(...uniqueOptions.episodeCounts)}
                    max={Math.max(...uniqueOptions.episodeCounts)}
                    value={filterStates.episodeRange}
                    onChange={filterStates.setEpisodeRange}
                    label="Episode count"
                />

                {/* Score Range */}
                <RangeSlider
                    min={Math.min(...uniqueOptions.scores)}
                    max={Math.max(...uniqueOptions.scores)}
                    value={filterStates.scoreRange}
                    onChange={filterStates.setScoreRange}
                    label="Score"
                />
            </div>
        </div>
    );
};
