import React, { useCallback, useMemo } from "react";

import { usePathname, useRouter } from "next/navigation";

import { ButtonGroup } from "@components/Button";
import { useTranslations } from "next-intl";

export const EventNavigation = () => {
    const router = useRouter();
    const pathName = usePathname();

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

    const value = useMemo(() => {
        const pathnames = pathName.split("/").filter((x) => x);

        if (pathnames.includes("video-capture")) {
            return "/event/video-capture";
        }

        return "/event";
    }, [pathName]);

    const handleNavigation = useCallback((value: string) => {
        router.push(value);
    }, []);

    return <ButtonGroup value={value} options={eventNavigation} onSelected={handleNavigation} />;
};
