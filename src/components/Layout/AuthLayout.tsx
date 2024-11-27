"use client";

import { ReactNode } from "react";

import { redirect, useSelectedLayoutSegment } from "next/navigation";

import { useAppStore } from "@store/appStore";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { userInfo } = useAppStore();
    const selectedLayoutSegment = useSelectedLayoutSegment();
    console.log("🚀 ~ AuthLayout ~ selectedLayoutSegment:", selectedLayoutSegment);
    console.log("🚀 ~ AuthLayout ~ userInfo:", userInfo);

    if (userInfo) {
        if (selectedLayoutSegment === "login") redirect("/dashboard");
    } else {
        if (selectedLayoutSegment !== "login") redirect("/login");
    }

    return children;
}
