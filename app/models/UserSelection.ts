import {MediaListStatus} from "@/app/gql/graphql";

export type UserSelection = {
    userNames: string[];
    selections: {
        [key in MediaListStatus]: number[];
    }
    watchState: MediaListStatus;
}

export const createEmptySelections = (): UserSelection['selections'] => ({
    COMPLETED: [],
    CURRENT: [],
    DROPPED: [],
    PAUSED: [],
    PLANNING: [],
    REPEATING: []
});

export const defaultUserSelection: UserSelection = {
    userNames: [''],
    watchState: MediaListStatus.Current,
    selections: createEmptySelections()
}