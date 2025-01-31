'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import configuration from '@/configuration';
import { getOpeningThemeForAnime } from '@/app/services/animethemesApi';
import { useEffect, useState } from 'react';
import {useAnimeSelections} from "@/app/hooks/useAnimeSelection";
import {useAnimeData} from "@/app/hooks/useAnimeData";
import {useResponsive} from "@/app/hooks/useResponsive";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import ConfigurationPanel from "@/app/components/Configuration/ConfigurationPanel";
import AnimeContent from "@/app/components/AnimeContent/AnimeContent";

export default function Main() {
    const {
        userSelection,
        setUserSelection,
        userSelectionsByUsernames,
        handleSelectAnime,
        setUsernames,
        setWatchState,
        createLocalStorageEntry,
        getUsernamesKey
    } = useAnimeSelections();

    const {
        animes,
        loading,
        error,
        fetchAnimes,
        fetchAnimeWithCache,
        fetchAnimeNoCache
    } = useAnimeData();

    const { isDesktop, windowSize, isClient } = useResponsive();
    const [showWheel, setShowWheel] = useState(false);
    const [drawnAnime, setDrawnAnime] = useState<AnimeEntryModel | null>(null);

    const { data: openingTheme } = useQuery({
        queryKey: ['openingTheme', drawnAnime?.id],
        queryFn: async () => getOpeningThemeForAnime(drawnAnime?.id as number),
        enabled: !!drawnAnime && configuration.enableOpenings,
    });

    const fetchButton = async () => {
        await fetchAnimes(fetchAnimeNoCache, userSelection.userNames, userSelection.watchState);
    };

    // Effect for fetching animes when usernames or watch state changes
    useEffect(() => {
        const usernamesKey = getUsernamesKey(userSelection.userNames);
        if (userSelectionsByUsernames[usernamesKey] &&
            userSelectionsByUsernames[usernamesKey].selections[userSelection.watchState]) {
            fetchAnimes(
                fetchAnimeWithCache,
                userSelection.userNames,
                userSelection.watchState
            ).catch(console.error);
        }
    }, [userSelection.userNames, userSelection.watchState]);

    // Effect for handling initial anime load and local storage
    useEffect(() => {
        const anyEmpty = (x: string) => x.trim() === '';
        // @ts-expect-error test
        if (animes.length === 0 || userSelection.usern.some(anyEmpty)) {
            return;
        }

        const usernamesKey = getUsernamesKey(userSelection.userNames);
        const existingSelection = userSelectionsByUsernames[usernamesKey];

        if (existingSelection) {
            setUserSelection(existingSelection);
        } else if (animes.length > 0) {
            createLocalStorageEntry(userSelection.userNames);
        }
    }, [animes]);

    const spinWheelSize = Math.min(0.5 * windowSize.width, 0.5 * windowSize.height);
    const selectedAnimes = animes.filter(
        anime => userSelection.selections[userSelection.watchState]?.includes(anime.id)
    );

    return (
        <div className={`flex ${isDesktop ? 'flex-row' : 'flex-col'} gap-6 w-full`}>
            <div className={`
                flex flex-col gap-6 w-full
                ${isDesktop ? 'lg:w-1/4 lg:sticky lg:top-10 lg:h-screen lg:overflow-y-auto lg:p-1' : ''}
            `}>
                <ConfigurationPanel
                    userSelection={userSelection}
                    loading={loading}
                    isClient={isClient}
                    showWheel={showWheel}
                    animes={animes}
                    selectedAnimes={selectedAnimes}
                    onSetUsernames={setUsernames}
                    onSetWatchState={setWatchState}
                    onFetchAnimes={fetchButton}
                    onShowWheel={() => setShowWheel(true)}
                />
            </div>

            <AnimeContent
                error={error}
                loading={loading}
                animes={animes}
                selectedAnimes={selectedAnimes}
                selectedIds={selectedAnimes.map(x => x.id)}
                showWheel={showWheel}
                spinWheelSize={spinWheelSize}
                drawnAnime={drawnAnime}
                openingTheme={openingTheme}
                onSelect={handleSelectAnime}
                onClose={() => setShowWheel(false)}
                onSelection={setDrawnAnime}
            />
        </div>
    );
}
