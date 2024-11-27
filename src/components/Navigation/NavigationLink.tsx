"use client";

import { ComponentProps } from "react";

import { useSelectedLayoutSegment } from "next/navigation";

import { Link } from "@libs/i18n/routing";
import clsx from "clsx";

export const NavigationLink = ({ href, ...rest }: ComponentProps<typeof Link>) => {
    const selectedLayoutSegment = useSelectedLayoutSegment();
    const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
    const isActive = pathname === href;

    return (
        <Link
            aria-current={isActive ? "page" : undefined}
            className={clsx(
                "inline-block px-2 py-3 transition-colors",
                isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
            )}
            href={href}
            {...rest}
        />
    );
};
