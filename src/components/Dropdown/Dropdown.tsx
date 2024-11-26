"use client";

import { useState } from "react";

import { SvgIconComponent } from "@mui/icons-material";
import { styled } from "@mui/material";
import { MenuProps, Menu as MuiMenu, MenuItem as MuiMenuItem } from "@mui/material";

export type IDropdownOption = {
    key: string;
    label: string;
    icon?: SvgIconComponent;
    disable?: boolean;
};

export type IDropdownProps = {
    menu: IDropdownOption[];
    menuProps?: Partial<MenuProps>;
    onClick?: (i: IDropdownOption) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const MenuItem = styled(MuiMenuItem)`
    display: flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 13px;
    gap: 8px;
    transition: all 0.3s ease;
    border-bottom: 1px solid #e6eaf2;

    .icon {
        font-size: 18px;
    }

    :first-of-type {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    :last-of-type {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        border-bottom: none;
    }

    :hover {
        background-color: #f5f5f5;
    }
`;

export const Dropdown = ({ menu, children, onClick, menuProps, ...props }: IDropdownProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Open dropdown when mouse enters
    const onOpenDropdown = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    // Close dropdown when mouse leaves
    const onMouseLeave = () => {
        handleClose();
    };

    const handleSelectItem = (item: IDropdownOption) => {
        if (onClick) {
            onClick(item);
        }
        handleClose();
    };

    return (
        <div {...props}>
            <div
                aria-haspopup='true'
                aria-expanded={open ? "true" : undefined}
                aria-controls={open ? "basic-menu" : undefined}
                id='basic-button'
                // onMouseEnter={onOpenDropdown}
                // onMouseLeave={handleClose}
                onClick={onOpenDropdown}
            >
                {children}
            </div>

            <MuiMenu
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: "12px",
                        background: "#fff",
                        marginTop: "6px"
                    }
                }}
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                    sx: { padding: 0 }
                }}
                {...menuProps}
            >
                {menu.map((item) => {
                    return (
                        <MenuItem key={item.key} onClick={() => handleSelectItem(item)}>
                            {item.icon && <item.icon className='icon' />}
                            <div className='label'>{item.label}</div>
                        </MenuItem>
                    );
                })}
            </MuiMenu>
        </div>
    );
};
