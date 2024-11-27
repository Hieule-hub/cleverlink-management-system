import MainLayout from "@components/Layout/MainLayout";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
    const t = useTranslations("IndexPage");

    // const { locale } = await params;

    // Enable static rendering
    // setRequestLocale(locale);

    return (
        <MainLayout title={t("title")}>
            <p>
                {t.rich("description", {
                    code: (chunks) => <code className='font-mono text-white'>{chunks}</code>
                })}
            </p>
        </MainLayout>
    );
}
