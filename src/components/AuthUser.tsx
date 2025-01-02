"use client";

import React, { type ReactNode, useEffect } from "react";

import { useAppStore } from "@providers/AppStoreProvider";

import { Loading } from "./Loading";

const Auth = ({ children }: { children: ReactNode }) => {
    const { isFetching, fetUserInfo } = useAppStore((state) => state);

    useEffect(() => {
        fetUserInfo();
    }, []);

    if (isFetching) {
        return <Loading />;
    }

    return <React.Fragment>{children}</React.Fragment>;
};

export default Auth;
