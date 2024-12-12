"use client";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import withProtectedRoute from "@components/withProtectedRoute";
import { EventNavigation, VideoCapturePage } from "@modules/Event";
import { Box } from "@mui/material";

const Page = () => {
    return (
        <MainLayout>
            <Box display='flex' justifyContent='space-between'>
                <Breadcrumbs /> <EventNavigation />
            </Box>
            <VideoCapturePage />
        </MainLayout>
    );
};

export default withProtectedRoute(Page);
