import { create } from "zustand";

import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { theme as originOptions } from "@configs/theme";

const getTheme = (themeOptions: ThemeOptions) => {
    return createTheme({
        cssVariables: true,
        ...originOptions,
        ...themeOptions
    });
};

const themes = {
    super: getTheme({
        palette: {
            primary: {
                main: "#ff5252"
            }
        }
    }),
    admin: getTheme({
        palette: {
            primary: {
                main: "#ff5252"
            }
        }
    }),
    user: getTheme({
        palette: {
            primary: {
                main: "#ff5252"
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
