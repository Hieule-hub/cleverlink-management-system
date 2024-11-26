import { theme as originOptions } from "@configs/theme";
import { Theme, ThemeOptions, createTheme } from "@mui/material/styles";
import { RoleCode, UserInfo } from "User";
import { create } from "zustand";

const getTheme = (themeOptions: ThemeOptions) => {
    return createTheme({
        cssVariables: {
            cssVarPrefix: ""
        },
        ...originOptions,
        ...themeOptions
    });
};

type Themes = {
    [key in RoleCode]: Theme;
};

const themes: Themes = {
    CIP: getTheme({
        palette: {
            primary: {
                main: "#0074FF"
            }
        }
    }),
    BU: getTheme({
        palette: {
            primary: {
                main: "#FFC821"
            }
        }
    }),
    GU: getTheme({
        palette: {
            primary: {
                main: "#30B689"
            }
        }
    }),
    TU: getTheme({
        palette: {
            primary: {
                main: "#FF6C00"
            }
        }
    })
};

interface AppStore {
    role: RoleCode;
    theme: Theme;
    userInfo?: UserInfo;
    setUserInfo: (info: UserInfo) => void;
    setRole: (role: RoleCode) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    role: "CIP",
    theme: themes.CIP,
    setUserInfo: (userInfo) => set((state) => ({ ...state, userInfo })),
    setRole: (role) => set((state) => ({ ...state, role, theme: themes[role] }))
}));
