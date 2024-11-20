// hooks/useAnimeSelections.ts
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { MediaListStatus } from '@/app/gql/graphql';
import { UserSelection, defaultUserSelection, createEmptySelections } from '@/app/models/UserSelection';

export const useAnimeSelections = () => {
    const [userSelectionsByUsernames, setUserSelectionsByUsernames] = useLocalStorage<{ [key: string]: UserSelection }>(
        'userSelectionsByUsernames',
        {},
        { initializeWithValue: true }
    );
    const [lastUsernameKey, setLastUsernameKey] = useLocalStorage<string>(
        'lastUsernameKey',
        '',
        { initializeWithValue: true }
    );
    const [userSelection, setUserSelection] = useState<UserSelection>(defaultUserSelection);

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
    };

    const handleSelectAnime = (id: number) => {
        setUserSelection(prev => {
            const updatedSelections = {
                ...prev.selections,
                [prev.watchState]: prev.selections[prev.watchState].includes(id)
                    ? prev.selections[prev.watchState].filter(animeId => animeId !== id)
                    : [...prev.selections[prev.watchState], id],
            };

            const updatedSelection: UserSelection = { ...prev, selections: updatedSelections };
            const usernamesKey = getUsernamesKey(prev.userNames);

            setUserSelectionsByUsernames(prevSelections => ({
                ...prevSelections,
                [usernamesKey]: updatedSelection,
            }));

            return updatedSelection;
        });
    };

    const setUsernames = (usernames: string[]) => {
        setUserSelection(prev => ({ ...prev, userNames: usernames }));
    };

    const setWatchState = (watchState: MediaListStatus) => {
        const usernamesKey = getUsernamesKey(userSelection.userNames);
        setLastUsernameKey(usernamesKey);
        setUserSelection(prev => ({ ...prev, watchState }));
        setUserSelectionsByUsernames(prevSelections => {

            return {
                ...prevSelections,
                [usernamesKey]: {...prevSelections[usernamesKey], watchState},
            }
        });
    };

    // Initial setup effect
    useEffect(() => {
        if (lastUsernameKey) {
            const lastUserSelection = userSelectionsByUsernames[lastUsernameKey];
            if (lastUserSelection) {
                setUserSelection(lastUserSelection);
            }
        }
    }, [lastUsernameKey]);

    // Sync with local storage effect
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

    return {
        userSelection,
        setUserSelection,
        userSelectionsByUsernames,
        setUserSelectionsByUsernames,
        lastUsernameKey,
        setLastUsernameKey,
        getUsernamesKey,
        createLocalStorageEntry,
        handleSelectAnime,
        setUsernames,
        setWatchState
    };
};
