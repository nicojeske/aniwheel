import Image from "next/image";
import AnimeList from "@/app/components/AnimeList";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 sm:p-20">
            <main className="w-full max-w-5xl flex flex-col gap-8 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <AnimeList />
            </main>
        </div>
    );
}
