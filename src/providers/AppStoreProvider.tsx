"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";

import { type AppStore, createAppStore, initAppStore } from "@store/appStore";
import { useStore } from "zustand";

export type AppStoreApi = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<AppStoreApi | undefined>(undefined);

export interface AppStoreProviderProps {
    children: ReactNode;
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
    const storeRef = useRef<AppStoreApi>();

    if (!storeRef.current) {
        storeRef.current = createAppStore(initAppStore());
    }

    return <AppStoreContext.Provider value={storeRef.current}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = <T,>(selector: (store: AppStore) => T) => {
    const appStoreContext = useContext(AppStoreContext);

    if (!appStoreContext) {
        throw new Error("useAppStore must be used within a AppStoreProvider");
    }

    return useStore(appStoreContext, selector);
};
