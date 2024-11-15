import AnimeEntryModel from "@/app/models/AnimeEntry";
import {Media} from "@/app/gql/graphql";

function convertAnilistEntry (entry: Media): AnimeEntryModel {
    return {
        id: entry.id,
        title: entry.title?.english ?? entry.title?.romaji ?? "",
        coverImageUrl: entry.coverImage?.large ?? ""
    }
}

export default convertAnilistEntry