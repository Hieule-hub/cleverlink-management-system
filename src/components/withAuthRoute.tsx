"use client";

import { useEffect } from "react";

import { redirect } from "next/navigation";

import { useAppStore } from "@providers/AppStoreProvider";

const withAuthRoute = (Component: React.ComponentType) => {
    const WrappedComponent = (props) => {
        const userInfo = useAppStore((state) => state.userInfo);

        useEffect(() => {
            if (userInfo) {
                redirect("/dashboard");
            }
        }, [userInfo]);

        if (userInfo) {
            return null;
        }

        return !userInfo ? <Component {...props} /> : null;
    };

    WrappedComponent.displayName = `withAuthRoute(${Component.displayName || Component.name || "Component"})`;

    return WrappedComponent;
};

export default withAuthRoute;
