import AnimeList from "@/app/components/AnimeList";
import {useTranslations} from "next-intl";
import Footer from "@/app/components/Footer";

export default function Home() {
    const t = useTranslations('Home');

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col flex-grow items-center justify-center bg-gray-900 text-white p-8 sm:p-20">
                <main className="w-full max-w-screen-2xl flex flex-col gap-8 items-center sm:items-start">
                    <h1 className="text-4xl font-bold text-center sm:text-left">
                        {t('title')} <span className="text-blue-500">{t('title_highlight')}</span>
                    </h1>
                    <h4 className="text-lg text-center sm:text-left text-gray-400">{t('subtitle')}</h4>
                    <AnimeList/>
                </main>
            </div>
            <Footer/>
        </div>
    );
}
