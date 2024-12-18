"use client";

import React from "react";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import withProtectedRoute from "@components/withProtectedRoute";
import { CameraPage } from "@modules/Camera";

const Page = () => {
    return (
        <React.Fragment>
            <Breadcrumbs />
            <CameraPage />
        </React.Fragment>
    );
};

export default withProtectedRoute(Page);
