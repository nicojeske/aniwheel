import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/app/Providers";
import {getLocale, getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Aniwheel",
    description: "Spin the wheel to select an anime to watch with your friends!",
};

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <NextIntlClientProvider messages={messages}>
            <Providers>
                {children}
            </Providers>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
