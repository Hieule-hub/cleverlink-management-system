import type { Metadata } from "next";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@providers/ThemeProvider";
import { InternationalProvider } from "@providers/InternationalProvider";

import "@styles/globals.css";
import { Poppins } from "next/font/google";

import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@libs/i18n/routing";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    display: "swap",
    adjustFontFallback: false,
    variable: "--font-poppins"
});

export const metadata: Metadata = {
    title: "Clever-link Management System",
    description: "Clever-link Management System"
};

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

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
