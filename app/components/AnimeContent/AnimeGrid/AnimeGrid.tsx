import React, {useState} from "react";
import {MultipleSelectionModel} from "@/app/models/generic/MultipleSelectionModel";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import {useAnimeFilters} from "@/app/hooks/useAnimeFilter";
import AnimeFilters from "@/app/components/AnimeContent/AnimeGrid/Filter/AnimeFilters";
import AlertMessage from "@/app/components/AnimeContent/AnimeGrid/Alerts/AlertMessage";
import AnimeList from "@/app/components/AnimeContent/AnimeGrid/AnimeList";
import {MediaStatus} from "@/app/gql/graphql";

type AnimeGridProps = MultipleSelectionModel<AnimeEntryModel> & {
    wheelLimit?: number
}

const notYetReleasedState = "NOT_YET_RELEASED";


const AnimeGrid: React.FC<AnimeGridProps> = ({
                                                 models,
                                                 selectedIds,
                                                 onSelect,
                                                 wheelLimit,
                                             }) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isCompactMode, setIsCompactMode] = useState(false);

    const {
        uniqueOptions,
        filterStates,
        filterAnimes,
        selectedAnimesOutOfFiltered,
    } = useAnimeFilters(models, selectedIds);

    const filteredAnimes = filterAnimes(models, selectedIds);
    const isFiltering = filteredAnimes.length !== models.length;

    const clearSelection = () => {
        selectedIds.forEach(id => onSelect(id));
    };

    const handleSelectAll = () => {
        const allIds = filteredAnimes.map(anime => anime.id);
        const areAllSelected = filteredAnimes.every(anime =>
            selectedIds.includes(anime.id)
        );

        if (areAllSelected) {
            clearSelection();
        } else {
            allIds
                .filter(id => !selectedIds.includes(id))
                .forEach(id => onSelect(id));
        }
    };

    // When only not yet released is not selected as status
    const isDefaultFilterUnreleased =
        filterStates.selectedStatus.length === uniqueOptions.statuses.length -1 &&
        uniqueOptions.statuses.includes(MediaStatus.NotYetReleased) &&
        !filterStates.selectedStatus.includes(notYetReleasedState);

    return (
        <div className="flex flex-grow flex-col gap-4">
            <div>
                <AnimeFilters
                    filteredAnimes={filteredAnimes}
                    selectedIds={selectedIds}
                    totalAnimeCount={models.length}
                    uniqueOptions={uniqueOptions}
                    filterStates={filterStates}
                    showAdvancedFilters={showAdvancedFilters}
                    toggleAdvancedFiltersShown={() =>
                        setShowAdvancedFilters(!showAdvancedFilters)
                    }
                    toggleViewMode={() => setIsCompactMode(!isCompactMode)}
                    iscompactMode={isCompactMode}
                    onSelectAll={handleSelectAll}
                    clearSelection={clearSelection}
                />

                {isFiltering &&
                    selectedAnimesOutOfFiltered > 0 &&
                    selectedIds.length > 0 && (
                        <AlertMessage
                            icon="info"
                            message={`You have ${selectedAnimesOutOfFiltered} anime(s) selected outside the current filter. Your selection will remain active while filtering.`}
                        />
                    )}

                {wheelLimit && selectedIds.length > wheelLimit && (
                    <AlertMessage
                        icon="close"
                        message={`You have selected over ${wheelLimit} anime. For performance reasons the Wheel will select ${wheelLimit} anime randomly from your selection.`}
                    />
                )}

                {
                    isFiltering && isDefaultFilterUnreleased && (
                        <AlertMessage
                            icon="info"
                            message="Unreleased anime are not shown by default. You can enable them in the advanced filters."
                        />
                    )
                }
            </div>

            <AnimeList
                isCompactMode={isCompactMode}
                animes={filteredAnimes}
                selectedIds={selectedIds}
                onSelect={onSelect}
            />
        </div>
    );
};

export default AnimeGrid;