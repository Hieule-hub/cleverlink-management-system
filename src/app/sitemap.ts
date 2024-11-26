import { MetadataRoute } from "next";

import { host } from "@configs/app";
import { Locale, getPathname, routing } from "@libs/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
    return [getEntry("/"), getEntry("/pathnames")];
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntry(href: Href) {
    return {
        url: getUrl(href, routing.defaultLocale),
        alternates: {
            languages: Object.fromEntries(routing.locales.map((locale) => [locale, getUrl(href, locale)]))
        }
    };
}

function getUrl(href: Href, locale: Locale) {
    const pathname = getPathname({ locale, href });
    return host + pathname;
}
