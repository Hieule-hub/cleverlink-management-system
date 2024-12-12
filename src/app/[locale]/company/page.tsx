"use client";

import { redirect } from "next/navigation";

import withProtectedRoute from "@components/withProtectedRoute";
import { CompanyInfo, CompanyPage } from "@modules/Company";
import { useAppStore } from "@providers/AppStoreProvider";

import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import MainLayout from "@/components/Layout/MainLayout";

const CompanyPageRole = () => {
    const { role } = useAppStore((state) => state);

    if (role !== "TU" && role !== "CIP") {
        return redirect("/404");
    }

    return (
        <MainLayout>
            <Breadcrumbs />
            {role === "TU" && <CompanyInfo />}
            {role === "CIP" && <CompanyPage />}
        </MainLayout>
    );
};

export default withProtectedRoute(CompanyPageRole);
