import { UserInfo } from "@interfaces/user";
import resourceService from "@services/resource";
import userService from "@services/user";
import { Area, Organization, Role, RoleCode } from "common";
import { createStore } from "zustand/vanilla";

export type AppState = {
    isFetching: boolean;
    role: RoleCode;
    // theme: Theme;
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
        roles: [],
        organizations: [],
        areas: []
    };
};

export const defaultInitAppState: AppState = {
    isFetching: false,
    role: "CIP",
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
                        role: data.roleId.code
                    }));

                    await get().fetResources();
                }
            } catch (error) {
                console.log("🚀 ~ fetUserInfo: ~ error:", error);
            } finally {
                setTimeout(() => {
                    set((state) => ({ ...state, isFetching: false }));
                }, 1500);
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
