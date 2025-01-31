import Main from "@/app/components/Main";
import Footer from "@/app/components/Footer";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col flex-grow items-center justify-center bg-gray-900 text-white p-4 sm:p-20">
                <main className="w-full max-w-screen-2xl flex flex-col gap-8 items-center sm:items-start">
                    <h1 className="text-4xl font-bold text-center sm:text-left">
                        Welcome to the <span className="text-blue-500">Aniwheel</span>
                    </h1>
                    <h4 className="text-lg text-center sm:text-left text-gray-400">A simple tool to help you decide what anime to watch next.</h4>
                    <Main/>
                </main>
            </div>
            <Footer/>
        </div>
    );
}
