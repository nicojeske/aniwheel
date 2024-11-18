export type MultipleSelectionModel<Model> = {
    models: Model[];
    selectedIds: number[];
    onSelect: (id: number) => void;
}