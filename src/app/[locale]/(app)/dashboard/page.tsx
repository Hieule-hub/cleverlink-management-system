"use client";

import React from "react";

import { Breadcrumbs, RoleBreadcrumbs } from "@components/Layout/Breadcrumbs";
import withProtectedRoute from "@components/withProtectedRoute";
import { DashboardPage } from "@modules/Dashboard";
import { VideoCapturePage } from "@modules/Event";
import { SceneReadOnly } from "@modules/Scene";
import { useAppStore } from "@providers/AppStoreProvider";

const Page = () => {
    const { role } = useAppStore((state) => state);

    return (
        <React.Fragment>
            <Breadcrumbs />
            <RoleBreadcrumbs />
            {role === "CIP" && <DashboardPage />}
            {role === "TU" && <SceneReadOnly />}
            {role === "BU" && <VideoCapturePage />}
        </React.Fragment>
    );
};

export default withProtectedRoute(Page);
