import AnimeEntryModel from "@/app/models/AnimeEntry";
import {Maybe, Media, MediaSeason, MediaStatus} from "@/app/gql/graphql";

function convertAnilistEntry (entry: Media): AnimeEntryModel {
    return {
        id: entry.id,
        title: entry.title?.english ?? entry.title?.romaji ?? "",
        coverImageUrl: entry.coverImage?.extraLarge ?? "",
        averageScore: entry.averageScore ?? 0,
        episodeCount: entry.episodes ?? 0,
        genres: entry.genres ? RemoveMaybeAsList(entry.genres) : [],
        status: entry.status ? entry.status : MediaStatus.Finished,
        season: entry.season ? entry.season : MediaSeason.Fall,
        seasonYear: entry.seasonYear ?? 0,
    }
}

export const RemoveMaybeAsList = <T>(items: Maybe<T>[]): T[] => items.filter((x) => !!x) as T[];

export default convertAnilistEntry