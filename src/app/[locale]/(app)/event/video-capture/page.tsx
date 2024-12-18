"use client";

import React from "react";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import withProtectedRoute from "@components/withProtectedRoute";
import { EventNavigation, VideoCapturePage } from "@modules/Event";
import { Box } from "@mui/material";

const Page = () => {
    return (
        <React.Fragment>
            <Box display='flex' justifyContent='space-between'>
                <Breadcrumbs /> <EventNavigation />
            </Box>
            <VideoCapturePage />
        </React.Fragment>
    );
};

export default withProtectedRoute(Page);
