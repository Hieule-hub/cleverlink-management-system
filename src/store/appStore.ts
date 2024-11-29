import { theme as originOptions } from "@configs/theme";
import { RoleCode, UserInfo } from "@interfaces/user";
import { Theme, ThemeOptions, createTheme } from "@mui/material/styles";
import userService from "@services/user";
import { createStore } from "zustand/vanilla";

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
                main: "#0074FF",
                dark: "#193F72"
            }
        }
    }),
    BU: getTheme({
        palette: {
            primary: {
                main: "#FFC821",
                dark: "#595549"
            }
        }
    }),
    GU: getTheme({
        palette: {
            primary: {
                main: "#30B689",
                dark: "#51635D"
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

export type AppState = {
    isFetching: boolean;
    role: RoleCode;
    theme: Theme;
    userInfo?: UserInfo;
};

export type AppActions = {
    setUserInfo: (info: UserInfo) => void;
    fetUserInfo: () => void;
};

export type AppStore = AppState & AppActions;

export const initAppStore = (): AppState => {
    return {
        isFetching: false,
        role: "CIP",
        theme: themes.CIP
    };
};

export const defaultInitAppState: AppState = {
    isFetching: false,
    role: "CIP",
    theme: themes.CIP
};

export const createAppStore = (initState: AppState = defaultInitAppState) => {
    return createStore<AppStore>()((set, get) => ({
        ...initState,
        setUserInfo: (userInfo) => set((state) => ({ ...state, userInfo })),
        fetUserInfo: async () => {
            if (get().userInfo) return;

            set((state) => ({ ...state, isFetching: true }));
            try {
                const response = await userService.getUserInfo();

                if (!response.err) {
                    const { data } = response;
                    set((state) => ({
                        ...state,
                        userInfo: data,
                        role: data.roleId.code,
                        theme: themes[data.roleId.code]
                    }));
                }
            } catch (error) {
                console.log("🚀 ~ fetUserInfo: ~ error:", error);
            } finally {
                set((state) => ({ ...state, isFetching: false }));
            }
        }
    }));
};

// export const useAppStore = create<AppStore>((set, get) => ({
//     isFetching: false,
//     role: "CIP",
//     theme: themes.CIP,
//     setUserInfo: (userInfo) => set((state) => ({ ...state, userInfo })),
//     setRole: (role) => set((state) => ({ ...state, role, theme: themes[role] })),
//     fetUserInfo: async () => {
//         if (get().userInfo) return;

//         set((state) => ({ ...state, isFetching: true }));
//         try {
//             const response = await userService.getUserInfo();

//             if (!response.err) {
//                 const { data } = response;
//                 set((state) => ({ ...state, userInfo: data, role: data.roleId.code, theme: themes[data.roleId.code] }));
//             }
//         } catch (error) {
//             console.log("🚀 ~ fetUserInfo: ~ error:", error);
//         } finally {
//             set((state) => ({ ...state, isFetching: false }));
//         }
//     }
// }));
