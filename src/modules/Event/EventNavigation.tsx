import React, { useCallback, useMemo } from "react";

import { useRouter } from "next/navigation";

import { ButtonGroup } from "@components/Button";
import { useTranslations } from "next-intl";

export const EventNavigation = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    const router = useRouter();
    const t = useTranslations();

    const eventNavigation = useMemo(
        () => [
            {
                label: t("Common.List view"),
                value: "/event"
            },
            {
                label: t("Sidebar.Video capture"),
                value: "/event/video-capture"
            }
        ],
        [t]
    );

    const getValue = useCallback(() => {
        if (pathnames.includes("video-capture")) {
            return "/event/video-capture";
        }

        return "/event";
    }, [pathnames]);

    const handleNavigation = useCallback((value: string) => {
        router.push(value);
    }, []);

    return <ButtonGroup value={getValue()} options={eventNavigation} onSelected={handleNavigation} />;
};
