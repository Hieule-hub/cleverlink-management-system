import { create } from "zustand";

import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { theme as originOptions } from "@configs/theme";

const getTheme = (themeOptions: ThemeOptions) => {
    return createTheme({
        cssVariables: {
            cssVarPrefix: ""
        },
        ...originOptions,
        ...themeOptions
    });
};

const themes = {
    super: getTheme({
        palette: {
            primary: {
                main: "#0074FF"
            }
        }
    }),
    admin: getTheme({
        palette: {
            primary: {
                main: "#FFC821"
            }
        }
    }),
    user: getTheme({
        palette: {
            primary: {
                main: "#30B689"
            }
        }
    })
};

type UserRole = keyof typeof themes;

interface AppStore {
    role: UserRole;
    theme: Theme;
    setRole: (role: UserRole) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    role: "super",
    theme: themes.super,
    setRole: (role) => set((state) => ({ ...state, role, theme: themes[role] }))
}));
