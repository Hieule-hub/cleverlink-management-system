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
    height: 40px;
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

    &.default {
        background-color: white;
        color: #000;
        border: 1px solid #d0d5dd;
    }

    &.primary {
        border: none;
        background-color: #0074ff;

        &:hover {
            background-color: #448aff;
        }
    }

    &.danger {
        border: none;
        background-color: #ff1744;

        &:hover {
            background-color: #ff5252;
        }
    }

    &.success {
        border: none;
        background-color: #4caf50;

        &:hover {
            background-color: #388e3c;
        }
    }

    &.brown {
        border: none;
        background-color: #666666;

        &:hover {
            background-color: #333333;
        }
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

    &.loading {
        .spin {
            animation: spin 0.8s linear infinite;
        }
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
                <span className='spin'>
                    <SpinIcon color='inherit' sx={{ fontSize: "14px" }} />
                </span>
            )}
            {startIcon && !loading && <span className='icon'>{startIcon}</span>}
            <span>{children}</span>
            {endIcon && !loading && <span className='icon'>{endIcon}</span>}
        </StyledButton>
    );
};
