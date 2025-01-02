"use client";

import React from "react";

import { Breadcrumbs, RoleBreadcrumbs } from "@components/Layout/Breadcrumbs";
import withProtectedRoute from "@components/withProtectedRoute";
import { DashboardPage } from "@modules/Dashboard";
import { DeviceTU } from "@modules/Device";
import { EventBU } from "@modules/Event";
// import { SceneReadOnly } from "@modules/Scene";
import { useAppStore } from "@providers/AppStoreProvider";

const Page = () => {
    const role = useAppStore((state) => state.role);

    return (
        <React.Fragment>
            <Breadcrumbs />
            <RoleBreadcrumbs />
            {role === "CIP" && <DashboardPage />}
            {role === "TU" && <DeviceTU />}
            {role === "BU" && <EventBU />}
        </React.Fragment>
    );
};

export default withProtectedRoute(Page);
