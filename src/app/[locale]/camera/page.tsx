"use client";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import withProtectedRoute from "@components/withProtectedRoute";
import { CameraPage } from "@modules/Camera";

const Page = () => {
    return (
        <MainLayout>
            <Breadcrumbs />
            <CameraPage />
        </MainLayout>
    );
};

export default withProtectedRoute(Page);
