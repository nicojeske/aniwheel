import {getRequestConfig} from 'next-intl/server';
import {headers} from "next/headers";

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    let locale = 'en';

    const headerList = await headers();
    const siteUrl = headerList.get("x-forwarded-host");

    const customSiteUrl = process.env.NEXT_PUBLIC_CUSTOM_SITE_URL;

    if (siteUrl && customSiteUrl && (siteUrl.includes(customSiteUrl))) {
        locale = "de-pr";
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});