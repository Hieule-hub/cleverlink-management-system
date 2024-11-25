import React from "react";

import { styled } from "@mui/material";

import { SpinIcon } from "../Icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "default" | "primary" | "danger" | "success" | "brown";
    loading?: boolean;
    fullWidth?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const StyledButton = styled("button")`
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
    padding: 4px 15px;
    font-size: 0.875rem;
    height: var(--button-height);
    box-sizing: border-box;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-align: center;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    box-shadow: 0px 1px 2px 0px #1018280d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        opacity: 0.9;
    }

    &.default {
        background-color: white;
        color: #000;
        border: 1px solid #d0d5dd;
    }

    &.primary {
        border: none;
        background-color: var(--palette-primary-main);

        /* &:hover {
            background-color: var(--palette-primary-dark);
        } */
    }

    &.danger {
        border: none;
        background-color: var(--palette-danger-main);

        /* &:hover {
            background-color: var(--palette-danger-light);
        } */
    }

    &.success {
        border: none;
        background-color: var(--palette-success-main);

        /* &:hover {
            background-color: var(--palette-success-light);
        } */
    }

    .icon {
        box-sizing: border-box;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    //handle spin
    .spin {
        box-sizing: border-box;
        line-height: 1;
    }

    opacity: ${(props: ButtonProps) => (props.disabled ? 0.6 : 1)};
    width: ${(props: ButtonProps) => (props.fullWidth ? "100%" : "auto")};
`;

export const Button = ({
    color = "default",
    loading = false,
    startIcon,
    endIcon,
    children,
    className = "",
    ...props
}: ButtonProps) => {
    return (
        <StyledButton disabled={loading || props.disabled} className={className + " " + color} {...props}>
            {loading && (
                <span className='spin spinning'>
                    <SpinIcon color='inherit' sx={{ fontSize: "14px" }} />
                </span>
            )}
            {startIcon && !loading && <span className='icon'>{startIcon}</span>}
            <span>{children}</span>
            {endIcon && !loading && <span className='icon'>{endIcon}</span>}
        </StyledButton>
    );
};
