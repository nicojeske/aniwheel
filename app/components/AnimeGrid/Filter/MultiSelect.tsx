// components/filters/MultiSelect.tsx
import React, {useState} from 'react';

interface MultiSelectProps<T> {
    options: T[];
    selectedValues: T[];
    onChange: (values: T[]) => void;
    label: string;
    getOptionLabel?: (option: T) => string;
    placeholder?: string;
    searchable?: boolean;
    collapsible?: boolean;
}

export function MultiSelect<T>({
                                   options,
                                   selectedValues,
                                   onChange,
                                   label,
                                   getOptionLabel = (option: T) => String(option),
                                   placeholder = "Select...",
                                   searchable = false,
                                   collapsible = true
                               }: MultiSelectProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isExpanded, setIsExpanded] = useState(!collapsible); // Start expanded if not collapsible

    const handleOptionClick = (option: T) => {
        if (selectedValues.includes(option)) {
            onChange(selectedValues.filter(v => v !== option));
        } else {
            onChange([...selectedValues, option]);
        }
    };

    const handleRemoveOption = (option: T, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent expanding when removing
        onChange(selectedValues.filter(v => v !== option));
    };

    const handleContainerClick = () => {
        if (collapsible) {
            setIsExpanded(!isExpanded);
        }
    };

    const filteredOptions = options.filter(option =>
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div
                onClick={handleContainerClick}
                className={`${collapsible ? 'cursor-pointer' : ''} flex flex-col bg-gray-800 border border-gray-700 rounded-lg ${
                    isExpanded ? 'min-h-[45px]' : ''
                }`}
            >
                {/* Selected Values Display */}
                <div className="flex flex-wrap gap-2 p-2">
                    {selectedValues.length === 0 && (
                        <span className="text-sm text-gray-500">{placeholder}</span>
                    )}
                    {selectedValues.map((value, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-600 text-white"
                            onClick={(e) => handleRemoveOption(value, e)}
                        >
                            <span>{getOptionLabel(value)}</span>
                            <button
                                className="ml-1 hover:text-gray-300 focus:outline-none"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                    <div className="border-t border-gray-700">
                        {searchable && (
                            <div className="p-2 border-b border-gray-700">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                                    placeholder="Search..."
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2 p-2">
                            {filteredOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(option);
                                    }}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        selectedValues.includes(option)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {getOptionLabel(option)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Collapse/Expand indicator when collapsible is true */}
                {collapsible && (
                    <div className="flex justify-center border-t border-gray-700 p-1">
                        <span className="text-gray-400 text-sm">
                            {isExpanded ? '▲' : '▼'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}