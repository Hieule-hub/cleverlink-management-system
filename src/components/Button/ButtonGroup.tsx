import React, { useEffect, useState } from "react";

import { Box, BoxProps, styled } from "@mui/material";

interface Option {
    label: React.ReactNode;
    value: string;
}

const StyledButtonGroup = styled(Box)`
    height: 40px;
    border-radius: var(--shape-borderRadius);
    overflow: hidden;
    color: var(--text-primary);
    border: 1px solid var(--input-border-color);

    button {
        height: 100%;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 4px 15px;
        font-size: 14px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        user-select: none;
        outline: none;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: var(--palette-background-paper);

        &.active {
            background-color: #f9fafb;
            color: var(--palette-primary-main);
        }

        &:hover {
            color: var(--palette-primary-light);
        }

        border-right: 1px solid var(--input-border-color);
        &:last-child {
            border-right: none;
        }
    }
`;

interface ButtonGroupProps extends BoxProps {
    options: Option[];
    value?: string;
    onSelected?: (value: string) => void;
}

export const ButtonGroup = ({ options, value, onSelected, ...otherProps }: ButtonGroupProps) => {
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        if (value !== currentValue) {
            if (onSelected) onSelected(currentValue);
        }
    }, [currentValue, onSelected]);

    useEffect(() => {
        if (currentValue !== value) {
            setCurrentValue(value);
        }
    }, [value]);

    return (
        <StyledButtonGroup {...otherProps}>
            {options.map((option) => {
                return (
                    <button
                        className={currentValue === option.value ? "active" : ""}
                        key={option.value}
                        onClick={() => setCurrentValue(option.value)}
                    >
                        {option.label}
                    </button>
                );
            })}
        </StyledButtonGroup>
    );
};
