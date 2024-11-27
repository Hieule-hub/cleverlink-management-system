"use client";

import { ReactNode, useEffect, useState } from "react";

import { Box, Container } from "@mui/material";

import { Header } from "./Header";
import { DrawerHeader, Sidebar } from "./Sidebar";

type Props = {
    children?: ReactNode;
    title: ReactNode;
};

export default function MainLayout({ children, title }: Props) {
    const [isMenuCollapse, setIsMenuCollapse] = useState(true);

    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setIsMenuCollapse(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        // Check initial screen size
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleCollapseMenu = () => {
        setIsMenuCollapse((pre) => !pre);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Header isMenuCollapse={isMenuCollapse} />
            <Sidebar isMenuCollapse={isMenuCollapse} toggleCollapseMenu={handleCollapseMenu} />
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    height: "100%",
                    minHeight: "100vh"
                }}
            >
                <DrawerHeader />
                <Container
                    maxWidth='xl'
                    sx={{
                        my: 3
                    }}
                >
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
