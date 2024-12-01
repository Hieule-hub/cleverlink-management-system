"use client";

import React, { type ReactNode, useEffect } from "react";

import { useAppStore } from "@/providers/AppStoreProvider";

const Auth = ({ children }: { children: ReactNode }) => {
    const { fetUserInfo } = useAppStore((state) => state);

    useEffect(() => {
        fetUserInfo();
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};

export default Auth;
