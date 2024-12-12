"use client";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import withProtectedRoute from "@components/withProtectedRoute";
import { DashboardPage } from "@modules/Dashboard";
import { VideoCapturePage } from "@modules/Event";
import { SceneReadOnly } from "@modules/Scene";
import { useAppStore } from "@providers/AppStoreProvider";

const Page = () => {
    const { role } = useAppStore((state) => state);

    return (
        <MainLayout>
            <Breadcrumbs />
            {role === "CIP" && <DashboardPage />}
            {role === "TU" && <SceneReadOnly />}
            {role === "BU" && <VideoCapturePage />}
        </MainLayout>
    );
};

export default withProtectedRoute(Page);
