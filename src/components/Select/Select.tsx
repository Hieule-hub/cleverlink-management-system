import React, { useCallback } from "react";

import { ExpandMore } from "@mui/icons-material";
import {
    ListSubheader,
    MenuItem,
    Select as SelectMui,
    type SelectProps as SelectPropsMui,
    styled
} from "@mui/material";

const StyledPlaceholder = styled("span")`
    opacity: 0.5;
`;

interface Option {
    value: string | number;
    label: React.ReactNode;
    options?: Option[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
        }
    }
};

export type SelectProps = SelectPropsMui & {
    options?: Option[];
};

export const Select = ({
    value = null,
    placeholder = "",
    displayEmpty = true,
    options = [],
    ...otherProps
}: SelectProps) => {
    const findSelectedOption = useCallback(
        (selected: string | number) => {
            for (const option of options) {
                if (option.value === selected) return option;
                if (option.options) {
                    const subOption = option.options.find((sub) => sub.value === selected);
                    if (subOption) return subOption;
                }
            }
            return null;
        },
        [options]
    );

    const renderValue = useCallback(
        (selected: string | number) => {
            if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                return <StyledPlaceholder>{placeholder}</StyledPlaceholder>;
            }

            const selectedOption = findSelectedOption(selected);

            return selectedOption ? selectedOption.label : "Invalid";
        },
        [placeholder, findSelectedOption]
    );

    return (
        <SelectMui
            IconComponent={ExpandMore}
            value={value}
            renderValue={renderValue}
            displayEmpty={displayEmpty}
            MenuProps={MenuProps}
            {...otherProps}
        >
            {options.map((option) =>
                option.options ? (
                    // Return a grouped menu with a ListSubheader and sub-options
                    [
                        <ListSubheader key={"list-sub-header-" + option.value}>{option.label}</ListSubheader>,
                        ...option.options.map((subOption) => (
                            <MenuItem key={subOption.value} value={subOption.value}>
                                {subOption.label}
                            </MenuItem>
                        ))
                    ]
                ) : (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                )
            )}
        </SelectMui>
    );
};
