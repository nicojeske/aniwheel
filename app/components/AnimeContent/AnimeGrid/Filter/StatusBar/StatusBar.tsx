import React from 'react';
import CounterBadge from "@/app/components/AnimeContent/AnimeGrid/Filter/StatusBar/CounterBadge";
import ActionButton from "@/app/components/AnimeContent/AnimeGrid/Filter/StatusBar/ActionButton";
import ViewModeIcon from "@/app/components/AnimeContent/AnimeGrid/Filter/StatusBar/ViewModeIcon";

interface StatusBarProps {
    totalCount: number;
    selectedCount: number;
    filteredCount: number;
    showSelectedOnly: boolean;
    onToggleSelectedOnly: () => void;
    isCompactMode: boolean;
    onToggleViewMode: () => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
    areAllSelected: boolean;
}


export const StatusBar = ({
                              totalCount,
                              selectedCount,
                              filteredCount,
                              showSelectedOnly,
                              onToggleSelectedOnly,
                              isCompactMode,
                              onToggleViewMode,
                              onSelectAll,
                              onClearSelection,
                              areAllSelected
                          }: StatusBarProps) => {

    return (
        <div className="mt-4 mb-2 flex flex-wrap gap-4 items-center justify-between bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex flex-wrap items-center gap-6">
                <CounterBadge
                    label="Total"
                    count={totalCount}
                />

                <CounterBadge
                    label="Selected"
                    count={selectedCount}
                    variant={showSelectedOnly ? 'primary' : selectedCount > 0 ? 'success' : 'default'}
                    onClick={onToggleSelectedOnly}
                />

                {filteredCount !== totalCount && (
                    <CounterBadge
                        label="Filtered"
                        count={filteredCount}
                        variant="primary"
                    />
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-3 flex-grow justify-end">
                <ActionButton onClick={onToggleViewMode}>
                    <ViewModeIcon isCompact={isCompactMode} />
                    {isCompactMode ? "Grid View" : "Compact View"}
                </ActionButton>

                <ActionButton
                    onClick={onSelectAll}
                    disabled={filteredCount === 0}
                    variant="primary"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                    </svg>
                    {areAllSelected ? "Deselect All" : "Select All"}
                </ActionButton>

                {selectedCount > 0 && (
                    <ActionButton
                        onClick={onClearSelection}
                        variant="danger"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Clear Selection
                    </ActionButton>
                )}
            </div>
        </div>
    );
};