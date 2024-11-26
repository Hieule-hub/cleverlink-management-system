"use client";

import { ReactNode } from "react";

import { Toast } from "@components/Toast";
import { CssBaseline, ThemeProvider as ThemeProviderMui } from "@mui/material";
import { useAppStore } from "@store/appStore";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { theme } = useAppStore();

    return (
        <ThemeProviderMui theme={theme}>
            <CssBaseline />
            <Toast />
            {children}
        </ThemeProviderMui>
    );
};
