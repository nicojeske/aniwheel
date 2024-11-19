import Link from 'next/link';

export default function Impressum() {
    return (
        <main className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    The following information (Impressum) is required under German law.
                </h1>
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
                    <ul className=" text-gray-700">
                        <li>Nico Jeske</li>
                        <li>Nico Jeske IT</li>
                        <li>Grenzstr. 162A, 44534 Lünen, Germany</li>
                        <li>
                            <a
                                href="mailto:nico.jeske@gmail.com"
                                className="text-blue-500 hover:underline"
                            >
                                nico.jeske@gmail.com
                            </a>
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Online Dispute Resolution (ODR)
                    </h2>
                    <p className="text-gray-700">
                        To facilitate out-of-court dispute resolution, the European Commission provides the Online Dispute Resolution Website:
                        <a
                            href="https://ec.europa.eu/consumers/odr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline ml-1"
                        >
                            ec.europa.eu/consumers/odr
                        </a>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Legal Disclaimer</h2>
                    <p className="text-gray-700 mb-4">
                        The contents of these pages have been prepared with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the information provided.
                    </p>
                    <p className="text-gray-700">
                        Our website contains links to external websites. As the content of these third-party websites is beyond our control, we assume no liability for them. Responsibility for the content of the linked pages lies solely with the respective providers or operators.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Protection</h2>
                    <p className="text-gray-700">
                        In general, no personal data are stored when visiting the AniWheel website. Data will not be shared with third parties without your consent. Please note that unsecured data transmission over the internet (e.g., via email) may be subject to unauthorized access by third parties.
                    </p>
                </section>

                <footer className="text-gray-600 text-sm mb-6">
                    <Link href="https://language-boutique.de/muster-impressum" className="hover:underline">
                        Source: Language Boutique.de / Muster-Impressum
                    </Link>
                </footer>

                <div className="text-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
