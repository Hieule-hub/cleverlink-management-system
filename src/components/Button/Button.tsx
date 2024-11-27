import React from "react";

import { SvgIconComponent } from "@mui/icons-material";
import { styled } from "@mui/material";

import { SpinIcon } from "../Icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "default" | "primary" | "danger" | "success" | "brown";
    loading?: boolean;
    height?: string;
    fullWidth?: boolean;
    startIcon?: SvgIconComponent;
    endIcon?: SvgIconComponent;
}

const StyledButton = styled("button")`
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
    padding: 4px 15px;
    font-size: 14px;
    height: ${(props: ButtonProps) => (props.height === undefined ? "var(--button-height)" : props.height)};
    box-sizing: border-box;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    /* box-shadow: 0px 1px 2px 0px #1018280d; */
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
        font-size: 1.25rem;
    }

    //handle spin
    .spin {
        box-sizing: border-box;
        line-height: 1;
    }

    opacity: ${(props: ButtonProps) => (props.disabled ? 0.6 : 1)};
    width: ${(props: ButtonProps) => (props.fullWidth ? "100%" : "auto")};
`;

export const Button = ({ color = "default", loading = false, children, className = "", ...props }: ButtonProps) => {
    const { startIcon: StartIcon, endIcon: EndIcon } = props;

    return (
        <StyledButton disabled={loading || props.disabled} className={className + " " + color} {...props}>
            {loading && (
                <span className='spin spinning'>
                    <SpinIcon color='inherit' sx={{ fontSize: "14px" }} />
                </span>
            )}
            {StartIcon && !loading && (
                <span className='icon'>
                    <StartIcon fontSize='inherit' color='inherit' />
                </span>
            )}
            <span>{children}</span>
            {EndIcon && !loading && (
                <span className='icon'>
                    <EndIcon fontSize='inherit' color='inherit' />
                </span>
            )}
        </StyledButton>
    );
};
