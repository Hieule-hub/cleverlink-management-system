"use client";

import { ReactNode } from "react";

import { Toast } from "@components/Toast";
import { CssBaseline, ThemeProvider as ThemeProviderMui } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { theme } = useAppStore((state) => state);

    return (
        <ThemeProviderMui theme={theme}>
            <CssBaseline />
            <Toast />
            {children}
        </ThemeProviderMui>
    );
};
