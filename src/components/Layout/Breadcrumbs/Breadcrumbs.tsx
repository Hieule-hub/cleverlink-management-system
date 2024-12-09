import React from "react";

import { routeConfig } from "@configs/routeConfig";
import { Link } from "@libs/i18n/routing";
import { ArrowForwardIosOutlined, HomeOutlined } from "@mui/icons-material";
import { BreadcrumbsProps, Breadcrumbs as MUIBreadcrumbs, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const Breadcrumbs = (props: BreadcrumbsProps) => {
    const t = useTranslations("Sidebar");
    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbNameMap = routeConfig.reduce<any>((acc, cur) => {
        if (cur?.type === "divider") {
            return acc;
        }

        if (cur.children) {
            cur.children.map((c1) => {
                if (c1.children) {
                    c1.children.map((c2) => {
                        if (c2?.path) {
                            acc[c2.path] = t(c2.label || "");
                        }
                    });
                } else {
                    if (c1?.path) {
                        acc[c1.path] = t(c1.label || "");
                    }
                }
            });
        } else {
            if (cur?.path) {
                acc[cur.path] = t(cur.label || "");
            }
        }

        return acc;
    }, {});

    return (
        <MUIBreadcrumbs
            separator={<ArrowForwardIosOutlined sx={{ fontSize: 14 }} />}
            aria-label='breadcrumb'
            sx={{
                display: "flex",
                alignItems: "center",
                height: "40px"
            }}
            {...props}
        >
            <Link href='/' style={{ display: "flex", alignItems: "center" }}>
                <HomeOutlined color='primary' sx={{ fontSize: 22 }} />
            </Link>
            {pathnames.splice(0, 1).map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                const displayValue = breadcrumbNameMap[to] || value;

                if (last) {
                    return (
                        <Typography color='textPrimary' key={to}>
                            {displayValue}
                        </Typography>
                    );
                } else {
                    return (
                        <Typography
                            color='textPrimary'
                            key={to}
                            component='span'
                            sx={{ fontWeight: "bold" }}
                            style={{ cursor: "default" }}
                        >
                            {displayValue}
                        </Typography>
                    );
                }
            })}
        </MUIBreadcrumbs>
    );
};
