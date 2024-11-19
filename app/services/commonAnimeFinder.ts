import { QueryResult } from '@apollo/client';
import {AnimeForUserQuery, Exact, Media, MediaListStatus} from '@/app/gql/graphql';
import convertAnilistEntry from '@/app/mapper/AnimeEntryMapper';
import AnimeEntryModel from '@/app/models/AnimeEntry';

async function fetchAnimeForUser(
    username: string,
    status: MediaListStatus,
    fetchAnime: (options: {variables: { userName: string, status: MediaListStatus}}) => Promise<QueryResult<AnimeForUserQuery, Exact<{ userName?: string | null }>>>
): Promise<Map<number, AnimeEntryModel>> {
    const animeDetailsMap = new Map<number, AnimeEntryModel>();

    try {
        const { data }: QueryResult<AnimeForUserQuery, Exact<{ userName?: string | null }>> = await fetchAnime({
            variables: { userName: username.trim(), status },
        });

        if (data?.MediaListCollection?.lists?.[0]?.entries) {
            data.MediaListCollection.lists[0].entries.forEach((entry) => {
                const animeId = entry?.media?.id;

                if (animeId && entry.media) {
                    const media: Media = {
                        id: entry.media.id,
                        title: {
                            english: entry.media.title?.english,
                            romaji: entry.media.title?.romaji,
                        },
                        coverImage: {
                            extraLarge: entry.media.coverImage?.extraLarge,
                        },
                        isFavourite: false,
                        isFavouriteBlocked: false
                    }

                    animeDetailsMap.set(animeId, convertAnilistEntry(media));
                }
            });
        }
    } catch (error) {
        console.error(`Error fetching data for ${username}:`, error);
        // Handle error appropriately and optionally rethrow or return fallback value
    }

    return animeDetailsMap;
}

// Function to fetch animes and find common ones across multiple users
export async function getCommonAnimesForUsers(
    usernames: string[],
    status: MediaListStatus,
    fetchAnime: (options: {variables: { userName: string, status: MediaListStatus}}) => Promise<QueryResult<AnimeForUserQuery, Exact<{ userName?: string | null }>>>
): Promise<AnimeEntryModel[]> {
    const userAnimeLists: Set<number>[] = []; // Stores lists of anime IDs for each user
    const animeDetailsMap = new Map<number, AnimeEntryModel>(); // To store all anime details by ID

    for (const username of usernames) {
        if (username.trim()) {
            const userAnimeMap = await fetchAnimeForUser(username, status, fetchAnime);
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
        return [];
    }

    return [...commonAnimeIds].map((id) => animeDetailsMap.get(id)!);
}
