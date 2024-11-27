import { use } from "react";

import { redirect } from "next/navigation";

import MainLayout from "@components/Layout/MainLayout";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
    params: Promise<{ locale: string }>;
};

export default function IndexPage(props: Props) {
    redirect("/dashboard");

    const params = use(props.params);

    const { locale } = params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = useTranslations("IndexPage");

    return (
        <MainLayout title={t("title")}>
            <p className='max-w-[590px]'>
                {t.rich("description", {
                    code: (chunks) => <code>{chunks}</code>
                })}
            </p>
        </MainLayout>
    );
}
