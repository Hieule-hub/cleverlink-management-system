"use client";

import { type ReactNode, useEffect } from "react";

import { useAppStore } from "@/providers/AppStoreProvider";

const Auth = ({ children }: { children: ReactNode }) => {
    const { isFetching, fetUserInfo } = useAppStore((state) => state);

    useEffect(() => {
        fetUserInfo();
    }, []);

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return children;
};

export default Auth;
