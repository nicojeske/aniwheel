import {useState} from "react";
import {getCommonAnimesForUsers} from "@/app/services/commonAnimeFinder";
import {MediaListStatus} from "@/app/gql/graphql";
import {animesForUser} from "@/app/queries/anilistQueries";
import {useLazyQuery} from "@apollo/client";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import * as Sentry from "@sentry/react";

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
            const commonAnimesResult = await getCommonAnimesForUsers(userNames, watchState, fetchFunction);

            if (commonAnimesResult.failed) {
                const failure = commonAnimesResult.error;
                setError(failure.message);
                return [];
            }

            const commonAnimes = commonAnimesResult.data;

            setAnimes(commonAnimes);
            setError(null);
            return commonAnimes;
        } catch (error) {
            setError(`Failed to fetch animes. Please try again later.`);
            Sentry.captureException(error);
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