import {useState} from "react";
import {getCommonAnimesForUsers} from "@/app/services/commonAnimeFinder";
import {MediaListStatus} from "@/app/gql/graphql";
import {animesForUser} from "@/app/queries/anilistQueries";
import {useLazyQuery} from "@apollo/client";
import AnimeEntryModel from "@/app/models/AnimeEntry";

export const useAnimeData = () => {
    const [animes, setAnimes] = useState<AnimeEntryModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchAnimeWithCache] = useLazyQuery(animesForUser);
    const [fetchAnimeNoCache] = useLazyQuery(animesForUser, {fetchPolicy: 'no-cache'});

    const fetchAnimes = async (
        fetchFunction: typeof fetchAnimeWithCache,
        userNames: string[],
        watchState: MediaListStatus
    ) => {
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

    return {
        animes,
        setAnimes,
        loading,
        error,
        fetchAnimes,
        fetchAnimeWithCache,
        fetchAnimeNoCache
    };
};