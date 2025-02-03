import React, { memo } from "react";

import { CipLogoIcon } from "@components/Icon";
import { ArrowBackOutlined, ArrowForwardOutlined } from "@mui/icons-material";
import { Divider as MuiDivider } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme, styled } from "@mui/material/styles";

import { MenuItemIcon, MenuSidebar } from "./MenuSidebar";

// import 'rc-menu/assets/index.css';

export const sideBarWidth = 272; //17rem

const openedMixin = (theme: Theme): CSSObject => ({
    width: sideBarWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: "hidden"
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: `calc(4rem + 1px)`
});

export const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    height: "4.5rem",
    alignItems: "center",
    // padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    ".logo-cip": {
        color: "white",
        width: "4rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2.8rem"
    },

    ".text-logo": {
        color: "white",
        fontSize: "2rem",
        fontWeight: "bold"
    }
}));

// const BoxImageLogo = styled(Box)`
//     transition: all 0.3s;
//     background-image: url("/assets/images/cipsystems_logo.png");
//     background-size: contain;
//     background-repeat: no-repeat;
//     background-position-y: center;
//     background-position-x: 12px;
//     flex: 1;
//     height: 23px;
// `;

const CollapseButton = styled("div")`
    display: flex;
    align-items: center;
    justify-content: end;
    height: 3.5rem;
    padding: 0 1rem;
`;

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open"
})(({ theme }) => ({
    width: sideBarWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme)
            }
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme)
            }
        }
    ]
}));

const DrawerContent = styled("div")`
    display: flex;
    flex-direction: column;
    background-color: var(--palette-primary-dark);
    height: 100vh;
`;

const DrawerBody = styled("div")`
    overflow-y: auto;
    flex: 1;
`;

const Divider = styled(MuiDivider)`
    background-color: white;
    opacity: 0.2;
`;

type SidebarProps = {
    isMenuCollapse: boolean;
    toggleCollapseMenu: () => void;
};

// eslint-disable-next-line react/display-name
export const Sidebar = memo(({ isMenuCollapse, toggleCollapseMenu }: SidebarProps) => {
    return (
        <Drawer variant='permanent' open={isMenuCollapse}>
            <DrawerContent>
                <DrawerHeader>
                    <div className='logo-cip'>
                        <CipLogoIcon fontSize='inherit' color='inherit' />
                    </div>
                    {/* <BoxImageLogo /> */}
                    <div
                        className='text-logo'
                        style={{
                            width: !isMenuCollapse ? "0" : "calc(100% - 4rem)"
                        }}
                    >
                        CleverLink
                    </div>
                </DrawerHeader>

                <Divider />

                <DrawerBody>
                    <MenuSidebar />
                </DrawerBody>

                <Divider />

                <CollapseButton>
                    <MenuItemIcon onClick={toggleCollapseMenu}>
                        {isMenuCollapse ? (
                            <ArrowBackOutlined className='icon' />
                        ) : (
                            <ArrowForwardOutlined className='icon' />
                        )}
                    </MenuItemIcon>
                </CollapseButton>
            </DrawerContent>
        </Drawer>
    );
});
