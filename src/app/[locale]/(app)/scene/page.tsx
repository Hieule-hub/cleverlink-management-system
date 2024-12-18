"use client";

import React from "react";

import withProtectedRoute from "@components/withProtectedRoute";
import { ScenePage } from "@modules/Scene";

import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";

const Page = () => {
    return (
        <React.Fragment>
            <Breadcrumbs />
            <ScenePage />
        </React.Fragment>
    );
};

export default withProtectedRoute(Page);
