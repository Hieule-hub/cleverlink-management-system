import { ReactNode } from "react";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { InternationalProvider } from "@providers/InternationalProvider";
import { ThemeProvider } from "@providers/ThemeProvider";
import { getMessages } from "next-intl/server";

import "@styles/globals.css";

import Navigation from "./Navigation";
import ProtectedLayout from "./ProtectedLayout";

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

    return (
        <html lang={locale}>
            <body className={poppins.variable}>
                <InternationalProvider locale={locale} message={messages}>
                    <AppRouterCacheProvider>
                        <ThemeProvider>{children}</ThemeProvider>
                    </AppRouterCacheProvider>
                </InternationalProvider>
            </body>
        </html>
    );
}
