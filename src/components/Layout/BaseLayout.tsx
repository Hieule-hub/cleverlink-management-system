import { ReactNode } from "react";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import Auth from "@components/AuthUser";
import { OverLoading } from "@components/Loading";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AppStoreProvider } from "@providers/AppStoreProvider";
import { IntErrorProvider } from "@providers/IntErrorProvider";
import { ThemeProvider } from "@providers/ThemeProvider";
import { getMessages, getTimeZone } from "next-intl/server";

import "@styles/globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    display: "swap",
    adjustFontFallback: false,
    variable: "--font-poppins"
});

type LayoutProps = {
    children: ReactNode;
    locale: string;
};

export const metadata: Metadata = {
    icons: {
        icon: "/favicon.ico"
    },
    title: "Clever-link Management System",
    description: "Clever-link Management System"
};

export default async function BaseLayout({ children, locale }: Readonly<LayoutProps>) {
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    const timeZone = await getTimeZone();

    return (
        <html lang={locale}>
            <body className={poppins.variable}>
                <IntErrorProvider timeZone={timeZone} locale={locale} messages={messages}>
                    <AppRouterCacheProvider>
                        <AppStoreProvider>
                            <OverLoading />
                            <Auth>
                                <ThemeProvider>{children}</ThemeProvider>
                            </Auth>
                        </AppStoreProvider>
                    </AppRouterCacheProvider>
                </IntErrorProvider>
            </body>
        </html>
    );
}
