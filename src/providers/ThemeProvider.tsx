"use client";

import { ReactNode } from "react";

import { Toast } from "@components/Toast";
import { userThemes } from "@configs/theme";
import { CssBaseline, ThemeProvider as ThemeProviderMui } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { role } = useAppStore((state) => state);

    const theme = userThemes[role];

    return (
        <ThemeProviderMui theme={theme}>
            <CssBaseline />
            <Toast />
            {children}
        </ThemeProviderMui>
    );
};
