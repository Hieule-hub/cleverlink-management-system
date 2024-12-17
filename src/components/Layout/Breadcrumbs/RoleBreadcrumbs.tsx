import React from "react";

import { useRouter } from "next/navigation";

import { Button } from "@components/Button";
import { RouteConfig, routeConfig } from "@configs/routeConfig";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Divider, Stack, styled } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import { useTranslations } from "next-intl";

const StyledBreadcrumbs = styled("div")`
    display: flex;
    align-items: center;
    gap: 12px;

    .title {
        size: 30px;
        font-weight: bold;
    }

    .btn {
        box-shadow: 0px 4px 4px 0px #00000026;
        height: 35px;
        padding: 0 6px 0 10px;
    }
`;

export const RoleBreadcrumbs = () => {
    const { role, userInfo } = useAppStore((state) => state);
    const t = useTranslations("Sidebar");
    const router = useRouter();

    const handleClick = (route: RouteConfig) => {
        if (route?.path) {
            router.push(route.path);
        }
    };

    return (
        <StyledBreadcrumbs>
            <span className='title'>
                {role === "CIP" && "CIPSYSTEM"}
                {role === "TU" && userInfo.companyId?.name}
                {role === "BU" && `${userInfo.companyId?.name} <${userInfo.sceneId?.name}>`}
            </span>

            <Divider orientation='vertical' flexItem />

            {routeConfig
                .filter((route) => route.breadcrumbRole.includes(role))
                .map((route) => {
                    return (
                        <Button
                            className='btn'
                            color='primary'
                            key={route.key}
                            endIcon={KeyboardArrowRight}
                            onClick={() => handleClick(route)}
                        >
                            {t(route.label)}
                        </Button>
                    );
                })}

            {/* <Stack direction={"row"} gap={1}>
               
            </Stack> */}
        </StyledBreadcrumbs>
    );
};
