import React from 'react';
import {useTranslations} from "next-intl";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    toggleAdvancedFilters: () => void;
    showAdvancedFilters: boolean;
}

export const SearchBar = ({value, onChange, toggleAdvancedFilters, showAdvancedFilters}: SearchBarProps) => {
    const t = useTranslations('AnimeGrid');

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <input
                type="text"
                placeholder={t('filter_placeholder')}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 p-2 rounded-md bg-gray-800 text-white"
            />
            <button
                onClick={toggleAdvancedFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <svg
                    className={`w-5 h-5 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
                {t('advanced_filters')}
            </button>
        </div>
    );
};
