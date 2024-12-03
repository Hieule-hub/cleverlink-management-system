import React, { use, useCallback } from "react";

import { redirect } from "next/navigation";

import { Dropdown, IDropdownOption } from "@components/Dropdown";
import { PowerSettingsNew, SettingsOutlined } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import userService from "@services/user";
import { triggerToastDev } from "@utils/index";
import Cookies from "js-cookie";

export const Profile = () => {
    const { setUserInfo, userInfo } = useAppStore((state) => state);

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
                <Box padding={0} display='flex' marginY={"auto"} alignItems='center' sx={{ cursor: "pointer" }}>
                    <Avatar
                        alt='avatar'
                        src='https://avatarfiles.alphacoders.com/851/thumb-1920-85184.png'
                        sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant='userName' noWrap>
                        {userInfo?.name}
                    </Typography>
                </Box>
            </Dropdown>
        </React.Fragment>
    );
};
