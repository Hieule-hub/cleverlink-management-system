"use client";

import MainLayout from "@components/Layout/MainLayout";
import withProtectedRoute from "@components/withProtectedRoute";
import { useTranslations } from "next-intl";

const Page = () => {
    const t = useTranslations("IndexPage");

    return (
        <MainLayout title={t("title")}>
            <p>
                {t.rich("description", {
                    code: (chunks) => <code className='font-mono text-white'>{chunks}</code>
                })}
            </p>
        </MainLayout>
    );
};

export default withProtectedRoute(Page);
