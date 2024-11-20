'use client';

import React, {useEffect, useState} from 'react';
import {QueryResult, useLazyQuery} from '@apollo/client';
import {AnimeForUserQuery, Exact, MediaListStatus} from '@/app/gql/graphql';
import AnimeGrid from '@/app/components/AnimeGrid/AnimeGrid';
import UsernameInputs from '@/app/components/UsernameInputs';
import {animesForUser} from '@/app/queries/anilistQueries';
import {useTranslations} from 'next-intl';
import configuration from '@/configuration';
import {getCommonAnimesForUsers} from '@/app/services/commonAnimeFinder';
import SpinningWheelModal from '@/app/components/SpinningWheelModal';
import {useLocalStorage, useWindowSize} from 'usehooks-ts';
import MediaListStatusSelector from '@/app/components/MediaListStatusSelector';
import AnimeEntryModel from '@/app/models/AnimeEntry';
import CustomButton from '@/app/components/CustomButton';
import {useQuery} from '@tanstack/react-query';
import {getOpeningThemeForAnime} from '@/app/services/animethemesApi';
import {createEmptySelections, defaultUserSelection, UserSelection} from '@/app/models/UserSelection';
import KofiButton from "@/app/components/KofiButton";

export default function AnimeList() {
    const t = useTranslations('Selections');
    const windowSize = useWindowSize();

    const [isClient, setIsClient] = useState(false);
    const isDesktop = isClient && windowSize.width >= 1024; // Assuming 1024px as the breakpoint for desktop

    const [userSelectionsByUsernames, setUserSelectionsByUsernames] = useLocalStorage<{ [key: string]: UserSelection }>(
        'userSelectionsByUsernames',
        {},
        {initializeWithValue: true}
    );
    const [lastUsernameKey, setLastUsernameKey] = useLocalStorage<string>('lastUsernameKey', '', {initializeWithValue: true});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true)
        if (lastUsernameKey) {
            const lastUserSelection = userSelectionsByUsernames[lastUsernameKey];
            if (lastUserSelection) {
                setUserSelection(lastUserSelection);
            }
        }
    }, []);


    const [userSelection, setUserSelection] = useState<UserSelection>(defaultUserSelection);
    const [animes, setAnimes] = useState<AnimeEntryModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [showWheel, setShowWheel] = useState(false);
    const [drawnAnime, setDrawnAnime] = useState<AnimeEntryModel | null>(null);

    const [fetchAnimeWithCache] = useLazyQuery(animesForUser);
    const [fetchAnimeNoCache] = useLazyQuery(animesForUser, {fetchPolicy: 'no-cache'});

    const {data} = useQuery({
        queryKey: ['openingTheme', drawnAnime?.id],
        queryFn: async () => getOpeningThemeForAnime(drawnAnime?.id as number),
        enabled: !!drawnAnime && configuration.enableOpenings,
    });

    const getUsernamesKey = (usernames: string[]) => {
        return usernames
            .map(username => username.trim().toLowerCase())
            .filter(Boolean)
            .sort()
            .join(',');
    };

    const createLocalStorageEntry = (usernames: string[]) => {
        const usernamesKey = getUsernamesKey(usernames);
        setUserSelectionsByUsernames(prev => ({
            ...prev,
            [usernamesKey]: {
                userNames: usernames,
                watchState: MediaListStatus.Current,
                selections: createEmptySelections(),
            },
        }));
        setUserSelection(prev => ({
            ...prev,
            userNames: usernames,
            watchState: MediaListStatus.Current,
            selections: createEmptySelections(),
        }));
    }

    const fetchAnimes = async (
        fetchFunction: (options: {
            variables: { userName: string; status: MediaListStatus }
        }) => Promise<QueryResult<AnimeForUserQuery, Exact<{ userName?: string | null }>>>,
        userNames: string[],
        watchState: MediaListStatus
    ): Promise<AnimeEntryModel[]> => {
        setLoading(true);

        try {
            const commonAnimes = await getCommonAnimesForUsers(userNames, watchState, fetchFunction);
            setAnimes(commonAnimes);
            setError(null);
            return commonAnimes;
        } catch (error) {
            console.error('Error fetching animes:', error);
            setError('Animes could not be fetched. Please try again later.');
            return [];
        } finally {
            setLoading(false);
        }
    };


    const fetchButton = async () => {
        await fetchAnimes(fetchAnimeNoCache, userSelection.userNames, userSelection.watchState);
    };

    const handleSelectAnime = (id: number) => {
        setUserSelection(prev => {
            const updatedSelections = {
                ...prev.selections,
                [prev.watchState]: prev.selections[prev.watchState].includes(id)
                    ? prev.selections[prev.watchState].filter(animeId => animeId !== id)
                    : [...prev.selections[prev.watchState], id],
            };

            const updatedSelection: UserSelection = {...prev, selections: updatedSelections};

            const usernamesKey = getUsernamesKey(prev.userNames);
            setUserSelectionsByUsernames(prevSelections => ({
                ...prevSelections,
                [usernamesKey]: updatedSelection,
            }));

            return updatedSelection;
        });
    };

    const setUsernames = (usernames: string[]) => {
        setUserSelection(prev => ({...prev, userNames: usernames}));
        setAnimes([]);
    };

    const setWatchState = (watchState: MediaListStatus) => {
        const usernamesKey = getUsernamesKey(userSelection.userNames);
        setUserSelection(prev => ({...prev, watchState}));
        setUserSelectionsByUsernames(prevSelections => ({
            ...prevSelections,
            [usernamesKey]: {...prevSelections[usernamesKey], watchState},
        }));
        setAnimes([]);
    };

    useEffect(() => {
        const usernamesKey = getUsernamesKey(userSelection.userNames);
        if (userSelectionsByUsernames[usernamesKey] && userSelectionsByUsernames[usernamesKey].selections[userSelection.watchState]) {
            setLastUsernameKey(usernamesKey);
            fetchAnimes(fetchAnimeWithCache, userSelection.userNames, userSelection.watchState).catch(console.error);
        }
    }, [userSelection.userNames, userSelection.watchState]);

    useEffect(() => {
        const anyEmpty = (x: string) => x.trim() === '';
        if (animes.length === 0 || userSelection.userNames.some(anyEmpty))
            return;

        const usernamesKey = getUsernamesKey(userSelection.userNames);
        const existingSelection = userSelectionsByUsernames[usernamesKey];

        if (existingSelection) {
            setUserSelection(existingSelection);
        } else if (animes.length > 0) { // Only store user selection if animes are fetched
            createLocalStorageEntry(userSelection.userNames);
        }
    }, [animes]);

    useEffect(() => {
        const localUserselection = userSelectionsByUsernames[getUsernamesKey(userSelection.userNames)];
        const storageUserSelection = userSelectionsByUsernames[getUsernamesKey(userSelection.userNames)];

        if (localUserselection && storageUserSelection) {
            setUserSelection(prevSelections => ({
                ...prevSelections,
                selections: storageUserSelection.selections,
            }));
        }
    }, [userSelectionsByUsernames]);

    const spinWheelSize = Math.min(0.5 * windowSize.width, 0.5 * windowSize.height);
    const selectedAnimes = animes.filter(anime => userSelection.selections[userSelection.watchState]?.includes(anime.id));

    return (
        <div className={`flex ${isDesktop ? 'flex-row' : 'flex-col'} gap-6 w-full`}>
            <div className={`
            flex flex-col gap-6 w-full
            ${isDesktop ? 'lg:w-1/4 lg:sticky lg:top-10 lg:h-screen lg:overflow-y-auto lg:p-1' : ''}
            `}>
                <KofiButton/>

                {/* Username Inputs */}
                <UsernameInputs
                    usernames={userSelection.userNames}
                    setUsernames={setUsernames}
                />

                {/* MediaListStatus Selector */}
                <MediaListStatusSelector
                    selectedWatchState={userSelection.watchState}
                    setSelectedWatchState={setWatchState}
                />

                {/* Fetch Button */}
                <CustomButton
                    disabled={loading || (isClient && !userSelection.userNames.some(u => u.trim()))}
                    onClick={fetchButton}
                    color="secondary"
                    text={t('fetch_button')}
                    disabledText={t('fetch_button_disabled')}
                    loading={loading}
                />

                {/* Show Wheel Button */}
                {animes && animes.length > 0 && (
                    <CustomButton
                        onClick={() => setShowWheel(true)}
                        text={t('show_wheel_button')}
                        color="tertiary"
                        disabled={selectedAnimes.length < 2}
                    />
                )}</div>

            <div className="mt-8 lg:mt-0 lg:w-3/4">
                {/* Anime Grid */}
                <div className="mt-8 lg:mt-0">
                    {error && <div className="text-red-500">{t('fetch_error')}
                </div>}
                    {loading ? (
                        <div>{t('loading')}</div>
                    ) : animes.length > 0 ? (
                        <>
                            <AnimeGrid models={animes} selectedIds={selectedAnimes.map(x => x.id)}
                                       onSelect={handleSelectAnime}/>
                        </>
                    ) : (
                        <div>{t('no_common')}</div>
                    )}
                </div>

                {/* Spinning Wheel Modal */}
                {
                    showWheel && selectedAnimes.length >= 2 && (
                        <SpinningWheelModal
                            selectedAnimes={selectedAnimes}
                            onClose={() => setShowWheel(false)}
                            onSelection={(anime) => setDrawnAnime(anime)}
                            spinWheelSize={spinWheelSize}
                            showConfetti={!!drawnAnime && configuration.enableConfetti}
                            openingTheme={data}
                        />
                    )
                }</div>
        </div>
    );
}
