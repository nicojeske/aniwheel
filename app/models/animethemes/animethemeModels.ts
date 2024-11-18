export interface AnimeThemesRootResponse {
    anime: Anime[]
    links: Links
    meta: Meta
}

export interface Anime {
    id: number
    name: string
    media_format: string
    season: string
    slug: string
    synopsis: string
    year: number
    animethemes: Animetheme[]
}

export interface Animetheme {
    id: number
    sequence?: number
    slug: string
    type: string
    animethemeentries: Animethemeentry[]
    song: Song
}

export interface Animethemeentry {
    id: number
    episodes: string
    notes: string
    nsfw: boolean
    spoiler: boolean
    version: string
    videos: Video[]
}

export interface Video {
    id: number
    basename: string
    filename: string
    lyrics: boolean
    nc: boolean
    overlap: string
    path: string
    resolution: number
    size: number
    source: string
    subbed: boolean
    uncen: boolean
    tags: string
    link: string
    audio: Audio
}

export interface Audio {
    id: number
    basename: string
    filename: string
    path: string
    size: number
    link: string
}

export interface Song {
    id: number
    title: string
}

export interface Links {
    first: string
    last: string
    prev: string
    next: string
}

export interface Meta {
    current_page: number
    from: number
    path: string
    per_page: number
    to: number
}
