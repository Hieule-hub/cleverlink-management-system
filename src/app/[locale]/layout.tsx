import { ReactNode } from "react";

import { notFound } from "next/navigation";

import BaseLayout from "@components/Layout/BaseLayout";
import { routing } from "@libs/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
    children: ReactNode;
    params: { locale: string };
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">) {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: "LocaleLayout" });

    return {
        title: t("title")
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
