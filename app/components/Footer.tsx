import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex gap-5 items-center p-3 justify-center">
                <Link href="https://github.com/nicojeske/aniwheel" className="text-sm text-blue-400 hover:underline">
                    Github
                </Link>
                <Link href="/impressum" className="text-sm text-blue-400 hover:underline">
                    Impressum
                </Link>
                <p className="text-sm">&copy; {new Date().getFullYear()} Nico Jeske. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
