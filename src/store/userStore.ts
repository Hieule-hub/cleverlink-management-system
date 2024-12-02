import { User } from "@interfaces/user";
import { create } from "zustand";

type UserState = {
    open: boolean;
    user: User | null;
};

type UserActions = {
    openUserDialog: (user?: User) => void;
    closeUserDialog: () => void;
    setUser: (user: Partial<User>) => void;
};

type UserStore = UserState & UserActions;

const defaultUserState: UserState = {
    open: false,
    user: null
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
