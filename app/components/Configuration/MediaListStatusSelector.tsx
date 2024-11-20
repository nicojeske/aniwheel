import React, { useCallback } from 'react';
import { MediaListStatus } from '@/app/gql/graphql';
import { useTranslations } from "next-intl";
import { motion } from 'framer-motion';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

interface MediaListStatusDropdownProps {
    selectedWatchState: MediaListStatus;
    setSelectedWatchState: (watchState: MediaListStatus) => void;
}

const MediaListStatusDropdown: React.FC<MediaListStatusDropdownProps> = ({
                                                                             selectedWatchState,
                                                                             setSelectedWatchState
                                                                         }) => {
    const t = useTranslations('Selections');

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWatchState(e.target.value as MediaListStatus);
    }, [setSelectedWatchState]);

    const translateWatchState = useCallback((watchState: MediaListStatus) => {
        // @ts-expect-error - use enum as key
        return t(`watch_state.${watchState.toString()}`);
    }, [t]);

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="mediaListStatus" className="text-white font-medium">
                {t('select_watchstate_button')}
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
                            {translateWatchState(status)}
                        </option>
                    ))}
                </motion.select>
                <ChevronUpDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
};

export default React.memo(MediaListStatusDropdown);
