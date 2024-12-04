import React, { use, useCallback } from "react";

import { redirect } from "next/navigation";

import { Dropdown, IDropdownOption } from "@components/Dropdown";
import { PowerSettingsNew, SettingsOutlined } from "@mui/icons-material";
import { Avatar, Badge, Box, IconButton, Tooltip, Typography, styled } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import userService from "@services/user";
import { triggerToastDev } from "@utils/index";
import Cookies from "js-cookie";

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""'
        }
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0
        }
    }
}));

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
                <Box padding={0}>
                    <Tooltip title={userInfo?.name} placement='bottom'>
                        <StyledBadge
                            overlap='circular'
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            variant='dot'
                        >
                            <Avatar
                                alt='avatar'
                                // src='https://avatarfiles.alphacoders.com/851/thumb-1920-85184.png'
                                src='https://i.pinimg.com/736x/fd/dc/65/fddc658081a920fd45f0d2c657bdf6cd.jpg'
                                sx={{ width: 32, height: 32 }}
                            />
                        </StyledBadge>
                    </Tooltip>
                </Box>
            </Dropdown>
        </React.Fragment>
    );
};
