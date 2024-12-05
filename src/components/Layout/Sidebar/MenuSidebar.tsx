import React, { memo, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { RouteConfig, routeConfig } from "@configs/routeConfig";
import { ChevronRightOutlined } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import Menu, { Divider as RcDivider, Item as RcMenuItem, SubMenu as RcSubMenu } from "rc-menu";

// import 'rc-menu/assets/index.css';

const SubMenu = styled(RcSubMenu)`
    transition: all 0.3s ease;
    cursor: pointer;

    .rc-menu-submenu-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        padding: 0 !important;
        color: #fff;
    }

    &.rc-menu-submenu-selected,
    &.rc-menu-submenu-active,
    &.rc-menu-submenu-open,
    :hover {
        background: var(--palette-primary-main);
        .active-icon {
            background-color: var(--palette-primary-main);
        }

        .icon {
            color: #fff;
        }
    }

    &.rc-menu-item-active,
    &.rc-menu-submenu-active > .rc-menu-submenu-title {
        background-color: var(--palette-primary-main);
        .active-icon {
            background-color: var(--palette-primary-main);
        }

        .icon {
            color: #fff;
        }
    }
`;

const MenuItem = styled(RcMenuItem)`
    transition: all 0.3s ease;
    cursor: pointer;
    &.rc-menu-item {
        padding: 0;
    }

    &.rc-menu-item-selected,
    :hover {
        background: var(--palette-primary-main);

        .active-icon {
            background-color: var(--palette-primary-main);
        }

        .icon {
            color: #fff;
        }
    }

    position: relative;
    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

const Divider = styled(RcDivider)`
    background-color: #fff;
    opacity: 0.2;
`;

export const MenuItemContent = styled("div")`
    display: flex;
    align-items: center;
    color: #fff;
    height: 3.5rem;

    .menu-item-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 4rem;
        background-color: var(--palette-primary-dark);
    }
`;

const MenuItemLabel = styled("span")`
    margin: auto 1rem;
    font-size: 0.875rem;
`;

export const MenuItemIcon = styled("div")`
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    height: 2rem;
    width: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    cursor: pointer;

    .icon {
        font-size: 1rem;
    }

    :hover {
        background-color: var(--palette-primary-main);
        color: #fff;
    }
`;

const ExpandIcon = styled("div")`
    margin-right: 0.8rem;
    svg {
        transition: all 0.3s ease;
        &.expand-open {
            transform: rotate(90deg);
        }
        /* &.expand-close {
			transform: rotate(0deg);
		} */
    }
`;

// Helper to render Menu items and submenus recursively
const renderMenuItems = (
    items: RouteConfig[],
    onClick: (item: RouteConfig) => void,
    trans: (key?: string) => string
) => {
    return items.map((item) => {
        if (item.hidden) return null;

        if (item.type === "divider") {
            return <Divider key={item.key} />;
        }
        if (item.children) {
            return (
                <SubMenu
                    key={item.key}
                    title={
                        <MenuItemContent>
                            {item.icon ? (
                                <div className='menu-item-icon'>
                                    <MenuItemIcon className='active-icon'>
                                        <item.icon className='icon' />
                                    </MenuItemIcon>
                                </div>
                            ) : null}
                            {item.label && <MenuItemLabel>{trans(item.label)}</MenuItemLabel>}
                        </MenuItemContent>
                    }
                    expandIcon={({ isOpen }) => (
                        <ExpandIcon>
                            <ChevronRightOutlined className={isOpen ? "expand-open" : "expand-close"} />
                        </ExpandIcon>
                    )}
                >
                    {renderMenuItems(item.children, onClick, trans)}
                </SubMenu>
            );
        }
        return (
            <MenuItem key={item.key} onClick={() => (item.onClick ? item.onClick() : onClick(item))}>
                <MenuItemContent>
                    {item.icon ? (
                        <div className='menu-item-icon'>
                            <MenuItemIcon className='active-icon'>
                                <item.icon className='icon' />
                            </MenuItemIcon>
                        </div>
                    ) : null}
                    {item.label && <MenuItemLabel>{trans(item.label)}</MenuItemLabel>}
                </MenuItemContent>
            </MenuItem>
        );
    });
};

// eslint-disable-next-line react/display-name
export const MenuSidebar = memo(() => {
    const t = useTranslations("Sidebar");

    const router = useRouter();

    const [keyPath, setKeyPath] = useState<string[]>([]);

    useEffect(() => {
        const path = location.pathname;
        const pathKeys = path.split("/").filter((item) => item);
        setKeyPath(pathKeys);
    }, [location]);

    const handleClick = (route: RouteConfig) => {
        if (route?.path) {
            router.push(route.path);
        }
    };

    const translate = (key: string) => {
        return t(key);
    };

    return (
        <Menu
            style={{
                padding: 0,
                boxShadow: "none",
                borderRadius: 0,
                border: 0,
                margin: 0,
                overflowX: "hidden"
            }}
            selectedKeys={keyPath}
            // onClick={(e) => {
            // 	setKeyPath(e.keyPath);
            // }}
        >
            {renderMenuItems(routeConfig, handleClick, translate)}
        </Menu>
    );
});
