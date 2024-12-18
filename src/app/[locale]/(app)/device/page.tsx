"use client";

import React from "react";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import withProtectedRoute from "@components/withProtectedRoute";
import { DevicePage } from "@modules/Device";

const Page = () => {
    return (
        <React.Fragment>
            <Breadcrumbs />
            <DevicePage />
        </React.Fragment>
    );
};

export default withProtectedRoute(Page);
