import { LanguageButton } from "@components/Button/LanguageButton";
import { DateTimeGroup } from "@components/DateTimeGroup";
import { Profile } from "@components/Profile";
import { Button, Toolbar, Typography as TypographyMUI, useMediaQuery } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Theme, styled } from "@mui/material/styles";
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
    zIndex: theme.zIndex.drawer + 1,
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
    const t = useTranslations();
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
                <Typography noWrap>CleverLink</Typography>

                <DateTimeGroup
                    sx={{
                        display: matches ? "flex" : "none"
                    }}
                />

                {/* <DocumentButton
                    sx={{
                        display: matches ? "flex" : "none"
                    }}
                    startIcon={<ContentCopy />}
                    onClick={triggerToastDev}
                >
                    <p>{t("Threat response procedures manual")}</p>
                </DocumentButton> */}

                <Profile />
                <LanguageButton />
            </Toolbar>
        </AppBar>
    );
};
