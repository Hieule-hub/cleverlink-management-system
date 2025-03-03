"use client";

import { useEffect } from "react";

import { redirect } from "next/navigation";

import { useAppStore } from "@providers/AppStoreProvider";

const withProtectedRoute = (Component: React.ComponentType) => {
    const WrappedComponent = (props) => {
        const userInfo = useAppStore((state) => state.userInfo);

        useEffect(() => {
            if (!userInfo) {
                redirect("/login");
            }
        }, [userInfo]);

        return userInfo ? <Component {...props} /> : null;
    };

    WrappedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name || "Component"})`;

    return WrappedComponent;
};

export default withProtectedRoute;
