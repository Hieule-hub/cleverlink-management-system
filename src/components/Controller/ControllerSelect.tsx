import React from "react";

import { Select, type SelectProps } from "@components/Select";
import { FormHelperText } from "@mui/material";
import { type Control, Controller as ControllerRHF } from "react-hook-form";

interface ControllerProps {
    keyName?: string;
    placeholder?: string;
    selectProps?: SelectProps;
    disabled?: boolean;
    control: Control<any>;
    onChangeField?: (value?: any) => void;
}

export const ControllerSelect = ({
    keyName,
    control,
    placeholder,
    disabled,
    onChangeField = () => "",
    selectProps
}: ControllerProps) => {
    return (
        <ControllerRHF
            control={control}
            name={keyName}
            render={({ field, fieldState }) => {
                const { onChange, ...otherFields } = field;

                return (
                    <React.Fragment>
                        <Select
                            error={!!fieldState.error}
                            disabled={disabled}
                            onChange={(event) => {
                                onChange(event);
                                onChangeField(event.target.value);
                            }}
                            {...otherFields}
                            id={keyName}
                            placeholder={placeholder}
                            fullWidth
                            {...selectProps}
                        />
                        {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                    </React.Fragment>
                );
            }}
        />
    );
};
