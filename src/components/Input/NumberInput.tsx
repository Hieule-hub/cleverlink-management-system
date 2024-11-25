import React, { useState } from "react";

import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material";
import { InputBase, InputProps, styled } from "@mui/material";
import { colorsFormControl } from "@configs/theme";

const StyledNumberInput = styled(InputBase)<InputProps>`
    &:hover {
        .MuiInputBase-input {
            border: 1px solid ${colorsFormControl.borderHoverColor};
        }
    }

    &:after,
    &:before {
        border: none !important;
    }
    &.Mui-focused {
        /* .MuiInputBase-input {
			border: 1px solid ${colorsFormControl.borderFocusColor};
		} */
    }
    .MuiInputBase-input {
        transition: all 0.3s ease;
        padding: 8px 12px;
        padding-right: 65px;
        border: 1px solid #e0e0e0;
        color: ${colorsFormControl.color};
        border-radius: ${colorsFormControl.borderRadius};
        font-size: ${colorsFormControl.fontSize};
        box-sizing: border-box;
        height: 48px;
    }
    .MuiOutlinedInput-notchedOutline {
        border: none;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const ButtonWrapper = styled("div")`
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
`;

const ActionButton = styled("button")`
    border: none;
    background-color: transparent;
    cursor: pointer;
    width: 100%;
    height: 50%;
    background-color: #ececec;
    color: #667085;
    box-sizing: border-box;
    padding: 0;

    &:disabled {
        background-color: #f5f5f5;
        color: #b0b0b0;
        cursor: default;
    }
`;

const GroupActions = styled("div")`
    position: absolute;
    width: 62px;
    display: flex;
    flex-direction: column;
    height: 100%;
    right: 0;
    overflow: hidden;
    border-top-right-radius: ${colorsFormControl.borderRadius};
    border-bottom-right-radius: ${colorsFormControl.borderRadius};
    box-sizing: border-box;
    border: 1px solid transparent;
    border-left: 1px solid ${colorsFormControl.borderColor};
    button:first-of-type {
        border-bottom: 1px solid ${colorsFormControl.borderColor};
    }
`;

interface NumberInputProps extends InputProps {
    min?: number;
    max?: number;
    step?: number;
    endAdornment?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ min = -Infinity, max = Infinity, step = 1, value, onChange, endAdornment = "", disabled, ...props }, ref) => {
        const [internalValue, setInternalValue] = useState<number>(Number(value) || 0);

        const updateValue = (newValue: number) => {
            setInternalValue(newValue);
            onChange?.({
                target: { value: newValue.toString() }
            } as React.ChangeEvent<HTMLInputElement>);
        };

        const handleIncrement = () => {
            const newValue = Math.min(internalValue + step, max);
            updateValue(newValue);
        };

        const handleDecrement = () => {
            const newValue = Math.max(internalValue - step, min);
            updateValue(newValue);
        };

        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                handleIncrement();
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                handleDecrement();
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value.replace(endAdornment, "");
            // Check number value
            const numericValue = Number(inputValue);
            if (!isNaN(numericValue)) {
                const newValue = Math.max(min, Math.min(numericValue, max));
                setInternalValue(newValue);
                onChange?.({
                    ...e,
                    target: { ...e.target, value: newValue.toString() }
                });
            }
        };

        return (
            <ButtonWrapper>
                <StyledNumberInput
                    ref={ref}
                    type='text'
                    disabled={disabled}
                    value={`${internalValue}${endAdornment}`}
                    onChange={handleChange}
                    inputProps={{ min, max, step }}
                    onKeyDown={handleKeyDown}
                    {...props}
                />
                <GroupActions>
                    <ActionButton disabled={disabled} onClick={handleIncrement}>
                        <KeyboardArrowUpOutlined color='inherit' />
                    </ActionButton>
                    <ActionButton disabled={disabled} onClick={handleDecrement}>
                        <KeyboardArrowDownOutlined color='inherit' />
                    </ActionButton>
                </GroupActions>
            </ButtonWrapper>
        );
    }
);

NumberInput.displayName = "NumberInput";
