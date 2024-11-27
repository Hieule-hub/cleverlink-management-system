"use client";

import { ReactNode, useEffect } from "react";

import { redirect, useSelectedLayoutSegment } from "next/navigation";

import { useAppStore } from "@store/appStore";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    // const { isFetching, userInfo, fetUserInfo } = useAppStore();
    // const selectedLayoutSegment = useSelectedLayoutSegment();

    // useEffect(() => {
    //     if (!userInfo) fetUserInfo();
    // }, [userInfo, selectedLayoutSegment]);

    // if (isFetching) return <div>Loading...</div>;

    // if (userInfo) {
    //     if (selectedLayoutSegment === "login") redirect("/dashboard");
    // } else {
    //     if (selectedLayoutSegment !== "login") redirect("/login");
    // }

    return children;
}
