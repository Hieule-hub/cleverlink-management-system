"use client";

import withProtectedRoute from "@components/withProtectedRoute";
import { ScenePage } from "@modules/Scene";

import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import MainLayout from "@/components/Layout/MainLayout";

const Page = () => {
    return (
        <MainLayout>
            <Breadcrumbs />
            <ScenePage />
        </MainLayout>
    );
};

export default withProtectedRoute(Page);
