import { create } from "zustand";

import { UserInfo } from "@/interfaces/user";

type UserState = {
    open: boolean;
    user?: UserInfo;
};

type UserActions = {
    openUserDialog: (user?: UserInfo) => void;
    closeUserDialog: () => void;
    setUser: (user: Partial<UserInfo>) => void;
};

type UserStore = UserState & UserActions;

const defaultUserState: UserState = {
    open: false
};

export const useUserStore = create<UserStore>()((set) => ({
    ...defaultUserState,
    openUserDialog: (user) => set({ open: true, user }),
    closeUserDialog: () => set({ open: false }),
    setUser: (user) =>
        set((state) => ({
            user: {
                ...state.user,
                ...user
            }
        }))
}));
