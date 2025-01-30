import {MediaSeason, MediaStatus} from "@/app/gql/graphql";

type AnimeEntryModel = {
    id: number,
    title: string,
    coverImageUrlLarge: string,
    coverImageUrlMedium: string,
    averageScore: number,
    episodeCount: number,
    genres: string[],
    status: MediaStatus,
    season: MediaSeason,
    seasonYear: number,
}

export default AnimeEntryModel