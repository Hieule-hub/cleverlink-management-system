import { theme as originOptions } from "@configs/theme";
import { UserInfo } from "@interfaces/user";
import { Theme, ThemeOptions, createTheme } from "@mui/material/styles";
import resourceService from "@services/resource";
import userService from "@services/user";
import { Area, Organization, Role, RoleCode } from "common";
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
    roles: Role[];
    organizations: Organization[];
    areas: Area[];
};

export type AppActions = {
    setUserInfo: (info: UserInfo) => void;
    fetUserInfo: () => Promise<void>;
    fetResources: () => Promise<void>;
};

export type AppStore = AppState & AppActions;

export const initAppStore = (): AppState => {
    return {
        isFetching: true,
        role: "CIP",
        theme: themes.CIP,
        roles: [],
        organizations: [],
        areas: []
    };
};

export const defaultInitAppState: AppState = {
    isFetching: false,
    role: "CIP",
    theme: themes.CIP,
    roles: [],
    organizations: [],
    areas: []
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

                    await get().fetResources();
                }
            } catch (error) {
                console.log("🚀 ~ fetUserInfo: ~ error:", error);
            } finally {
                setTimeout(() => {
                    set((state) => ({ ...state, isFetching: false }));
                }, 2000);
            }
        },
        fetResources: async () => {
            try {
                const [roles, organizations, areas] = await resourceService.getResources();
                set((state) => ({ ...state, roles: roles, organizations: organizations, areas: areas }));
            } catch (error) {
                console.log("🚀 ~ fetResources: ~ error:", error);
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
