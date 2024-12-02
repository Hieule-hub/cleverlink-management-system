import TextField, { TextFieldProps } from "@mui/material/TextField";
import { type Control, Controller as ControllerRHF } from "react-hook-form";

interface ControllerProps {
    keyName?: string;
    placeholder?: string;
    inputProps?: TextFieldProps;
    control: Control<any>;
    disabled?: boolean;
    hidden?: boolean;
}

export const ControllerInput = ({
    hidden,
    keyName,
    control,
    placeholder,
    inputProps,
    disabled = false
}: ControllerProps) => {
    return (
        <ControllerRHF
            control={control}
            name={keyName}
            render={({ field }) => {
                if (hidden) {
                    return (
                        <input id={keyName} placeholder={placeholder} disabled={disabled} type='hidden' {...field} />
                    );
                }

                return (
                    <TextField
                        {...field}
                        id={keyName}
                        placeholder={placeholder}
                        fullWidth
                        disabled={disabled}
                        {...inputProps}
                    />
                );
            }}
        />
    );
};
