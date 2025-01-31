import React, { useCallback } from 'react';
import { MediaListStatus } from '@/app/gql/graphql';
import { motion } from 'framer-motion';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import {convertMediaStatusToString} from "@/app/mapper/WatchStatusMapper";

interface MediaListStatusDropdownProps {
    selectedWatchState: MediaListStatus;
    setSelectedWatchState: (watchState: MediaListStatus) => void;
}

const MediaListStatusDropdown: React.FC<MediaListStatusDropdownProps> = ({
                                                                             selectedWatchState,
                                                                             setSelectedWatchState
                                                                         }) => {

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWatchState(e.target.value as MediaListStatus);
    }, [setSelectedWatchState]);

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="mediaListStatus" className="text-white font-medium">
                Watch status
            </label>
            <div className="relative">
                <motion.select
                    id="mediaListStatus"
                    value={selectedWatchState}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 border border-gray-600 bg-gray-800 text-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    whileTap={{ scale: 0.98 }}
                >
                    {Object.values(MediaListStatus).map((status) => (
                        <option key={status} value={status} className="bg-gray-800">
                            {convertMediaStatusToString(status)}
                        </option>
                    ))}
                </motion.select>
                <ChevronUpDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
};

export default React.memo(MediaListStatusDropdown);
