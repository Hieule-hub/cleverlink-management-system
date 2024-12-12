"use client";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import withProtectedRoute from "@components/withProtectedRoute";
import { UserPage } from "@modules/User";

const Page = () => {
    return (
        <MainLayout>
            <Breadcrumbs />
            <UserPage />
        </MainLayout>
    );
};

export default withProtectedRoute(Page);
