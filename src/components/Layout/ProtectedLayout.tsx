"use client";

import { ReactNode } from "react";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function ProtectedLayout({ children }: AuthLayoutProps) {
    return children;
}
