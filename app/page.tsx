import AnimeList from "@/app/components/AnimeList";
import {useTranslations} from "next-intl";

export default function Home() {
    const t = useTranslations('Home');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 sm:p-20">
            <main className="w-full max-w-5xl flex flex-col gap-8 items-center sm:items-start">
                <h1 className="text-4xl font-bold text-center sm:text-left">
                    {t('title')} <span className="text-blue-500">{t('title_highlight')}</span>
                </h1>
                <AnimeList />
            </main>
        </div>
    );
}
