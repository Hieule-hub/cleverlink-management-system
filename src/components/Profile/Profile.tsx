import React, { useCallback } from "react";

import { useRouter } from "next/navigation";

import { Dropdown } from "@components/Dropdown";
import { PowerSettingsNew, SettingsOutlined } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { triggerToastDev } from "@utils/index";

export const Profile = () => {
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        // await logout();
    }, [router]);

    const handleSelectItem = (item: any) => {
        switch (item.key) {
            case "logout":
                handleLogout();
                break;
            default:
                triggerToastDev();
                break;
        }
    };

    const items = [
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
            <Dropdown menu={items} onClick={handleSelectItem}>
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
