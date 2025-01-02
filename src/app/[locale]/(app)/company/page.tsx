"use client";

import React from "react";

import { redirect } from "next/navigation";

import withProtectedRoute from "@components/withProtectedRoute";
import { CompanyInfo, CompanyPage } from "@modules/Company";
import { useAppStore } from "@providers/AppStoreProvider";

import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";

const CompanyPageRole = () => {
    const role = useAppStore((state) => state.role);

    if (role !== "TU" && role !== "CIP") {
        return redirect("/404");
    }

    return (
        <React.Fragment>
            <Breadcrumbs />
            {role === "TU" && <CompanyInfo />}
            {role === "CIP" && <CompanyPage />}
        </React.Fragment>
    );
};

export default withProtectedRoute(CompanyPageRole);
