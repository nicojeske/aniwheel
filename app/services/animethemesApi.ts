import {AnimeThemesRootResponse} from "@/app/models/animethemes/animethemeModels";

export type OpeningWithName = {
    name: string;
    openingUrl: string;
}

export async function getOpeningThemeForAnime(animeId: number): Promise<OpeningWithName> {
    const response = await fetch(`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=${animeId}&include=animethemes.animethemeentries.videos.audio,animethemes.song`)
    const res: AnimeThemesRootResponse = await response.json();

    const openingTheme = res.anime[0].animethemes.filter(theme => theme.type === 'OP')[0];
    const name = openingTheme.song.title;
    const openingUrl = openingTheme.animethemeentries[0].videos[0].audio.link;

    return {name, openingUrl};
}