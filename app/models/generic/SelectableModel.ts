export type SelectableModel<Model> = Model & {
    selected: boolean;
    onSelect: (id: number) => void;
}