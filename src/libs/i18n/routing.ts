import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["en", "ko"],

    // Used when no locale matches
    defaultLocale: "en",
    pathnames: {
        "/": "/",
        "/login": "/login",
        "/pathnames": {
            en: "/pathnames",
            ko: "/padnamen"
        }
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
// export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
