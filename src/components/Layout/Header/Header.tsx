import { useMemo } from "react";

import { Button } from "@components/Button";
import { LanguageButton } from "@components/Button/LanguageButton";
import { DateTimeGroup } from "@components/DateTimeGroup";
import { Profile } from "@components/Profile";
import { Monitor } from "@mui/icons-material";
import { Toolbar, Typography as TypographyMUI, useMediaQuery } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Theme, styled } from "@mui/material/styles";
import { useAppStore } from "@providers/AppStoreProvider";
import { useTranslations } from "next-intl";

import { sideBarWidth } from "../Sidebar";

type CProps = {
    isMenuCollapse: boolean;
};

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const Typography = styled(TypographyMUI)`
    font-size: 1.4rem;
    flex-grow: 1;
    color: #040849;
    font-weight: bold;
`;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme }) => ({
    marginLeft: "4rem",
    width: `calc(100% - 4rem)`,
    background: "white",
    // zIndex: theme.zIndex.drawer,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: sideBarWidth,
                width: `calc(100% - ${sideBarWidth}px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen
                })
            }
        }
    ]
}));

export const Header = ({ isMenuCollapse }: CProps) => {
    const t = useTranslations("App");
    const userInfo = useAppStore((state) => state.userInfo);

    const companyName = useMemo(() => {
        if (userInfo?.roleId?.code === "CIP") return "";

        if (userInfo?.roleId?.code === "TU" && userInfo?.companyId?.name) {
            return "\xa0".repeat(2) + `[${userInfo?.companyId?.name}]`;
        }

        if (userInfo?.roleId?.code === "BU" && userInfo?.sceneId?.name) {
            return "\xa0".repeat(2) + `[${userInfo?.sceneId?.name}]`;
        }

        return "";
    }, [userInfo]);

    const matches = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

    return (
        <AppBar
            position='fixed'
            open={isMenuCollapse}
            sx={{
                boxShadow: "0 -6px 8px 2px rgba(0,0,0,0.4)"
            }}
        >
            <Toolbar
                sx={{
                    gap: 1,
                    height: "4.5rem"
                }}
            >
                <Typography noWrap>{t("logo-text") + companyName}</Typography>

                <DateTimeGroup
                    sx={{
                        display: matches ? "flex" : "none"
                    }}
                />

                <Button
                    style={{
                        display: matches ? "flex" : "none",
                        borderRadius: "30px",
                        fontSize: "0.8rem",
                        height: "32px",
                        minWidth: "150px"
                    }}
                    color='primary'
                    startIcon={Monitor}
                    onClick={() => {
                        window.open(`http://211.54.64.204:3000/login`, "_blank");
                    }}
                >
                    {t("Integrated Monitor")}
                </Button>

                <Profile />
                <LanguageButton />
            </Toolbar>
        </AppBar>
    );
};
