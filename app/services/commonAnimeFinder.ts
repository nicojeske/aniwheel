import {QueryResult} from '@apollo/client';
import {AnimeForUserDocument, AnimeForUserQuery, Exact, Media, MediaListStatus} from '@/app/gql/graphql';
import convertAnilistEntry from '@/app/mapper/AnimeEntryMapper';
import AnimeEntryModel from '@/app/models/AnimeEntry';
import {failure, Result, success} from "@/app/utils/result";


interface AnimeForUserQueryError {
    status: number;
    message: string;
}

async function fetchAnimeForUser(
    username: string,
    status: MediaListStatus,
    fetchAnime: (options: {
        variables: { userName: string, status: MediaListStatus }
    }) => Promise<QueryResult<AnimeForUserQuery, Exact<{ userName?: string | null }>>>
): Promise<Result<Map<number, AnimeEntryModel>, AnimeForUserQueryError>>  {
    const animeDetailsMap = new Map<number, AnimeEntryModel>();

    const {data, error}: QueryResult<AnimeForUserQuery, Exact<{ userName?: string | null }>> = await fetchAnime({
        variables: {userName: username.trim(), status},
    });

    if (error) {
        // @ts-expect-error ignore typing error
        if (error.graphQLErrors && error.graphQLErrors.length > 0 && error.graphQLErrors[0].status === 404) {
            return failure({status: 404, message: `User "${username}" not found`});
        }
        throw new Error(`Failed to fetch anime for user "${username}"`);
    }

    if (data?.MediaListCollection?.lists?.[0]?.entries) {
        data.MediaListCollection.lists[0].entries.forEach((entry) => {
            const animeId = entry?.media?.id;

            if (animeId && entry.media) {
                const media: Media = {
                    ...entry.media,
                    isFavourite: false,
                    isFavouriteBlocked: false
                }

                animeDetailsMap.set(animeId, convertAnilistEntry(media));
            }
        });
    }

    return success(animeDetailsMap);
}

// Function to fetch animes and find common ones across multiple users
export async function getCommonAnimesForUsers(
    usernames: string[],
    status: MediaListStatus,
    fetchAnime: (options: {
        variables: { userName: string, status: MediaListStatus }
    }) => Promise<QueryResult<AnimeForUserQuery, Exact<{ userName?: string | null }>>>
): Promise<Result<AnimeEntryModel[], AnimeForUserQueryError>> {
    const userAnimeLists: Set<number>[] = []; // Stores lists of anime IDs for each user
    const animeDetailsMap = new Map<number, AnimeEntryModel>(); // To store all anime details by ID

    for (const username of usernames) {
        if (username.trim()) {
            const result = await fetchAnimeForUser(username, status, fetchAnime);

            if (!result.success) {
                return failure(result.error);
            }

            const userAnimeMap = result.data;


            const animeIds = new Set(userAnimeMap.keys()); // Extract anime IDs as a set
            userAnimeLists.push(animeIds);

            userAnimeMap.forEach((anime, animeId) => {
                animeDetailsMap.set(animeId, anime);
            });
        }
    }

    const commonAnimeIds = userAnimeLists.reduce<Set<number> | null>((acc, set) => {
        return acc ? new Set([...acc].filter((id) => set.has(id))) : set;
    }, null);

    if (!commonAnimeIds) {
        return success([]);
    }

    return success([...commonAnimeIds].map((id) => animeDetailsMap.get(id)!));
}
