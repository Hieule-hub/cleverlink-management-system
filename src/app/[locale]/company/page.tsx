"use client";

import { redirect } from "next/navigation";

import withProtectedRoute from "@components/withProtectedRoute";
import { CompanyInfo, CompanyPage } from "@modules/Company";
import { useAppStore } from "@providers/AppStoreProvider";

import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import MainLayout from "@/components/Layout/MainLayout";

import NotFoundPage from "../not-found";

const CompanyPageRole = () => {
    const { role } = useAppStore((state) => state);

    const render = () => {
        if (role === "TU") {
            return <CompanyInfo />;
        } else if (role === "CIP") {
            return <CompanyPage />;
        }

        return redirect("/404");
    };

    return (
        <MainLayout>
            <Breadcrumbs />
            {render()}
        </MainLayout>
    );
};

export default withProtectedRoute(CompanyPageRole);
