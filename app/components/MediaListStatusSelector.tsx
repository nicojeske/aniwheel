import React from 'react';
import {MediaListStatus} from '@/app/gql/graphql';
import {useTranslations} from "next-intl";

interface MediaListStatusDropdownProps {
    selectedWatchState: MediaListStatus;
    setSelectedWatchState: (watchState: MediaListStatus) => void;
}

const MediaListStatusDropdown: React.FC<MediaListStatusDropdownProps> = ({
                                                                             selectedWatchState,
                                                                             setSelectedWatchState
                                                                         }) => {
    const t = useTranslations('Selections');
    return (
        <div className="flex flex-col gap-4">
            <label htmlFor="mediaListStatus" className="text-white">
                {t('select_watchstate_button')}
            </label>
            <select
                id="mediaListStatus"
                value={selectedWatchState}
                onChange={(e) => setSelectedWatchState(e.target.value as MediaListStatus)}
                className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            >
                {Object.values(MediaListStatus).map((status) => (
                    <option key={status} value={status}>
                        {/* @ts-expect-error Translation based on status enum*/}
                        {t(`watch_state.${status.toString()}`)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default React.memo(MediaListStatusDropdown);
