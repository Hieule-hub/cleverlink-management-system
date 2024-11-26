import PageLayout from "@components/Layout/PageLayout";
import { useTranslations } from "next-intl";

// import { setRequestLocale } from "next-intl/server";

type Props = {
    params: { locale: string };
};

export default function IndexPage({ params }: Props) {
    const t = useTranslations("IndexPage");

    // const { locale } = await params;

    // Enable static rendering
    // setRequestLocale(locale);

    return (
        <PageLayout title={t("title")}>
            <p className='max-w-[590px]'>
                {t.rich("description", {
                    code: (chunks) => <code className='font-mono text-white'>{chunks}</code>
                })}
            </p>
        </PageLayout>
    );
}
