"use client";

import React from "react";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import withProtectedRoute from "@components/withProtectedRoute";
import { UserPage } from "@modules/User";

const Page = () => {
    return (
        <React.Fragment>
            <Breadcrumbs />
            <UserPage />
        </React.Fragment>
    );
};

export default withProtectedRoute(Page);
