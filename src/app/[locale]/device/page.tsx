"use client";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import withProtectedRoute from "@components/withProtectedRoute";
import { DevicePage } from "@modules/Device";

const Page = () => {
    return (
        <MainLayout>
            <Breadcrumbs />
            <DevicePage />
        </MainLayout>
    );
};

export default withProtectedRoute(Page);
