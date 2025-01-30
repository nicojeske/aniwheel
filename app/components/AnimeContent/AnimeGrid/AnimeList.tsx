import AnimeEntryModel from "@/app/models/AnimeEntry";
import {CompactAnimeItem} from "@/app/components/AnimeContent/AnimeGrid/Card/CompactAnimeItem";
import AnimeCard from "@/app/components/AnimeContent/AnimeGrid/Card/AnimeCard";
import useInfiniteScroll from "@/app/hooks/useInfiniteScroll";

const AnimeList: React.FC<{
    isCompactMode: boolean;
    animes: AnimeEntryModel[];
    selectedIds: number[];
    onSelect: (id: number) => void;
}> = ({isCompactMode, animes, selectedIds, onSelect}) => {

    const {ref, data, hasMore} = useInfiniteScroll(animes, 9, 9)

    if (isCompactMode) {
        return (
            <div
                className="flex flex-col gap-2 p-0 md:p-4 bg-gray-900 text-white rounded-xl backdrop-blur-lg shadow-lg">
                {data.map((anime) => (
                    <CompactAnimeItem
                        key={anime.id}
                        anime={anime}
                        selected={selectedIds.includes(anime.id)}
                        onSelect={onSelect}
                    />
                ))}
                <div ref={hasMore ? ref : undefined}/>
            </div>
        );
    }

    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-0 md:p4 bg-gray-900 text-white rounded-xl backdrop-blur-lg shadow-lg">
            {data.map((anime) => (
                <AnimeCard
                    key={anime.id}
                    anime={anime}
                    selected={selectedIds.includes(anime.id)}
                    onSelect={onSelect}
                />
            ))}
            <div ref={hasMore ? ref : undefined}/>
        </div>
    );
}

export default AnimeList;