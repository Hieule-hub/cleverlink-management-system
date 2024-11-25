"use client";

import { CssBaseline, ThemeProvider as ThemeProviderMui } from "@mui/material";
import { useAppStore } from "@store/appStore";
import { ReactNode } from "react";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { theme } = useAppStore();

    return (
        <ThemeProviderMui theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProviderMui>
    );
};
