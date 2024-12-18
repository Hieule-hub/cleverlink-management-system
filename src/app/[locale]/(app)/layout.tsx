import { ReactNode } from "react";

import MainLayout from "@/components/Layout/MainLayout";

type Props = {
    children: ReactNode;
};

export default async function LocaleLayout({ children }: Props) {
    return <MainLayout>{children}</MainLayout>;
}
