import React, { useCallback } from "react";

import { ExpandMore } from "@mui/icons-material";
import { MenuItem, Select as SelectMui, type SelectProps as SelectPropsMui, styled } from "@mui/material";

const StyledPlaceholder = styled("span")`
    opacity: 0.5;
`;

interface Option {
    value: string | number;
    label: React.ReactNode;
}

export type SelectProps = SelectPropsMui & {
    options?: Option[];
};

export const Select = ({
    value = "",
    placeholder = "",
    displayEmpty = true,
    options = [],
    ...otherProps
}: SelectProps) => {
    const renderValue = useCallback(
        (selected: string | number) => {
            if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                return <StyledPlaceholder>{placeholder}</StyledPlaceholder>;
            }

            const selectedOption = options.find((option) => option.value === selected);

            return selectedOption ? selectedOption.label : null;
        },
        [placeholder, options]
    );

    return (
        <SelectMui
            IconComponent={ExpandMore}
            value={value}
            renderValue={renderValue}
            displayEmpty={displayEmpty}
            {...otherProps}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </SelectMui>
    );
};
