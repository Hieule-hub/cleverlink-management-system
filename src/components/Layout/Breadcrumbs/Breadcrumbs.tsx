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
        if (cur.path) {
            acc[cur.path] = t(cur.label);
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
            {pathnames.splice(1, 1).map((value, index) => {
                const title = breadcrumbNameMap["/" + value];

                return <Typography key={index}>{title}</Typography>;
            })}
        </MUIBreadcrumbs>
    );
};
