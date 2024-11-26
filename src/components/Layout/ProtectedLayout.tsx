"use client";

import { ReactNode } from "react";

import { redirect } from "next/navigation";

import { useAppStore } from "@store/appStore";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function ProtectedLayout({ children }: AuthLayoutProps) {
    const { userInfo } = useAppStore();
    console.log("🚀 ~ ProtectedLayout ~ userInfo:", userInfo);

    if (!userInfo) {
        redirect("/login");
    }
    return children;
}
