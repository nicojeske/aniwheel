import Image from "next/image";
import AnimeEntryModel from "@/app/models/AnimeEntry";

type AnimeEntryProps = {
    anime: AnimeEntryModel
}

const AnimeEntry = ({ anime }: AnimeEntryProps) => {
    return (
        <div>
            <Image src={anime.coverImageUrl} alt={anime.title} width={50} height={100} />
            <h2>{anime.title}</h2>
        </div>
    )
}

export default AnimeEntry