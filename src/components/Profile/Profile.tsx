import React, { use, useCallback } from "react";

import { redirect } from "next/navigation";

import { Dropdown, IDropdownOption } from "@components/Dropdown";
import { PowerSettingsNew, SettingsOutlined } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import userService from "@services/user";
import { triggerToastDev } from "@utils/index";
import Cookies from "js-cookie";

export const Profile = () => {
    const { setUserInfo } = useAppStore((state) => state);

    const handleLogout = useCallback(async () => {
        await userService.userLogout();

        //clear token
        localStorage.removeItem("access-token");
        Cookies.remove("refresh-token");
        setUserInfo(null);

        redirect("/login");
    }, []);

    const handleSelectItem = (item: IDropdownOption) => {
        switch (item.key) {
            case "logout":
                handleLogout();
                break;
            default:
                triggerToastDev();
                break;
        }
    };

    const items: IDropdownOption[] = [
        {
            key: "User-Management",
            label: "User Management",
            icon: SettingsOutlined
        },
        {
            key: "logout",
            label: "Logout",
            icon: PowerSettingsNew
        }
    ];

    return (
        <React.Fragment>
            <Dropdown menu={items} onSelectItem={handleSelectItem}>
                <IconButton sx={{ padding: 0 }}>
                    <Avatar
                        alt='avatar'
                        src='https://avatarfiles.alphacoders.com/851/thumb-1920-85184.png'
                        sx={{ width: 32, height: 32 }}
                    />
                </IconButton>
            </Dropdown>
        </React.Fragment>
    );
};
