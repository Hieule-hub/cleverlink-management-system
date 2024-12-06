import React from "react";

import { SvgIconComponent } from "@mui/icons-material";
import { styled } from "@mui/material";

import { SpinIcon } from "../Icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "default" | "primary" | "error" | "success" | "warning" | "info";
    loading?: boolean;
    height?: string;
    fullWidth?: boolean;
    startIcon?: SvgIconComponent;
    endIcon?: SvgIconComponent;
}

const StyledButton = styled("button")`
    border: none;
    cursor: pointer;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    padding: 4px 15px;
    font-size: 14px;
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

    // Disable
    &:disabled {
        cursor: not-allowed;
        pointer-events: none;
        background-color: var(--bg-container-disabled);
        opacity: var(--palette-action-opacity);
    }

    &.default:disabled,
    &.primary:disabled,
    &.error:disabled,
    &.success:disabled,
    &.warning:disabled,
    &.info:disabled {
        background-color: white;
        background-color: var(--bg-container-disabled);
        border: 1px solid var(--input-border-color);
    }

    &:hover {
        opacity: var(--palette-action-hover-opacity);
    }

    &:not(:disabled) {
        &.default {
            background-color: white;
            color: #344054;
            border: 1px solid var(--input-border-color);
            :hover {
                border-color: var(--palette-primary-main);
                color: var(--palette-primary-main);
            }
        }

        &.primary {
            border: none;
            background-color: var(--palette-primary-main);
            color: white;

            :hover {
                background-color: var(--palette-primary-light);
            }
        }

        &.error {
            border: none;
            color: white;
            background-color: var(--palette-error-main);

            :hover {
                background-color: var(--palette-error-light);
            }
        }

        &.success {
            border: none;
            color: white;
            background-color: var(--palette-success-main);

            :hover {
                background-color: var(--palette-success-light);
            }
        }

        &.warning {
            border: none;
            color: white;
            background-color: var(--palette-warning-main);

            :hover {
                background-color: var(--palette-warning-light);
            }
        }

        &.info {
            border: none;
            color: white;
            background-color: var(--palette-info-main);

            :hover {
                background-color: var(--palette-info-light);
            }
        }
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

    width: ${(props: ButtonProps) => (props.fullWidth ? "100%" : "auto")};
    height: ${(props: ButtonProps) => (props.height === undefined ? "var(--button-height)" : props.height)};
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
