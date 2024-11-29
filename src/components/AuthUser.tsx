"use client";

import { type ReactNode, useEffect } from "react";

import { useAppStore } from "@/providers/AppStoreProvider";

import { Loading } from "./Layout/Loading";

const Auth = ({ children }: { children: ReactNode }) => {
    const { isFetching, fetUserInfo } = useAppStore((state) => state);

    useEffect(() => {
        fetUserInfo();
    }, []);

    if (isFetching) {
        return <Loading />;
    }

    return children;
};

export default Auth;
