// components/AnimeGrid/AnimeFilters.tsx (continued)

import {SearchBar} from "@/app/components/AnimeContent/AnimeGrid/Filter/SearchBar";
import {AdvancedFilters} from "@/app/components/AnimeContent/AnimeGrid/Filter/AdvancedFilters";
import {StatusBar} from "@/app/components/AnimeContent/AnimeGrid/Filter/StatusBar/StatusBar";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {FilterStates, UniqueOptions} from "@/app/hooks/useAnimeFilter";

export interface AnimeFiltersProps {
    filterStates: FilterStates;
    toggleAdvancedFiltersShown: () => void;
    toggleViewMode: () => void;
    showAdvancedFilters: boolean;
    uniqueOptions: UniqueOptions;
    filteredAnimes: AnimeEntryModel[];
    totalAnimeCount: number;
    selectedIds: number[];
    iscompactMode: boolean;
    onSelectAll: () => void;
    clearSelection: () => void;
}

export default function AnimeFilters(props: AnimeFiltersProps) {
    const {
        filterStates,
        showAdvancedFilters,
        toggleAdvancedFiltersShown,
        uniqueOptions,
        filteredAnimes,
        totalAnimeCount,
        selectedIds,
        iscompactMode,
        toggleViewMode,
        onSelectAll,
        clearSelection,
    } = props;

    return (
        <>
            <SearchBar
                value={filterStates.filterText}
                onChange={filterStates.setFilterText}
                toggleAdvancedFilters={toggleAdvancedFiltersShown}
                showAdvancedFilters={showAdvancedFilters}
            />

            <AdvancedFilters
                shown={showAdvancedFilters}
                filterStates={filterStates}
                uniqueOptions={uniqueOptions}
            />

            <StatusBar
                totalCount={totalAnimeCount}
                selectedCount={selectedIds.length}
                filteredCount={filteredAnimes.length}
                showSelectedOnly={filterStates.showSelectedOnly}
                onToggleSelectedOnly={() =>
                    filterStates.setShowSelectedOnly(!filterStates.showSelectedOnly)
                }
                isCompactMode={iscompactMode}
                onToggleViewMode={toggleViewMode}
                onSelectAll={onSelectAll}
                onClearSelection={clearSelection}
                areAllSelected={filteredAnimes.every(
                    anime => selectedIds.includes(anime.id)
                )}
            />
        </>
    );
}
