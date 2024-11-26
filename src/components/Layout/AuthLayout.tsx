"use client";

import { ReactNode } from "react";

import { redirect } from "next/navigation";

import { useAppStore } from "@store/appStore";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { userInfo } = useAppStore();
    console.log("🚀 ~ AuthLayout ~ userInfo:", userInfo);

    if (userInfo) {
        redirect("/");
    }

    return children;
}
