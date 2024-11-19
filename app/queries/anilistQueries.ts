import {graphql} from "@/app/gql";

export const animesForUser = graphql(`
    query animeForUser($userName: String, $status: MediaListStatus) {
        MediaListCollection(userName: $userName, type: ANIME, status: $status) {
            hasNextChunk
            lists {
                entries {
                    mediaId
                    media {
                        coverImage {
                            extraLarge
                        }
                        title {
                            english
                            romaji
                        }
                        id
                    }
                }
            }
        }
    }
`);