"use client";

import MainLayout from "@components/Layout/MainLayout";
import { useTranslations } from "next-intl";

export const DashboardPage = () => {
    const t = useTranslations("IndexPage");

    return (
        <MainLayout title={t("title")}>
            <h1>{t("title")}</h1>
        </MainLayout>
    );
};
