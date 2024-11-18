import {MediaListStatus} from "@/app/gql/graphql";

export function convertMediaStatusToString(mediaStatus: MediaListStatus): string {
    switch (mediaStatus) {
        case MediaListStatus.Completed:
            return 'Completed';
        case MediaListStatus.Current:
            return 'Currently Watching';
        case MediaListStatus.Dropped:
            return 'Dropped';
        case MediaListStatus.Planning:
            return 'Plan to Watch';
        case MediaListStatus.Paused:
            return 'Paused';
        case MediaListStatus.Repeating:
            return 'Repeating';
    }
}

export function convertStringToMediaStatus(mediaStatus: string): MediaListStatus {
    switch (mediaStatus) {
        case 'Completed':
            return MediaListStatus.Completed;
        case 'Currently Watching':
            return MediaListStatus.Current;
        case 'Dropped':
            return MediaListStatus.Dropped;
        case 'Plan to Watch':
            return MediaListStatus.Planning;
        case 'Paused':
            return MediaListStatus.Paused;
        case 'Repeating':
            return MediaListStatus.Repeating;
        default:
            return MediaListStatus.Current;
    }
}