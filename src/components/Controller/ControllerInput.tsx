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
            render={({ field, fieldState }) => {
                if (hidden) {
                    return (
                        <input
                            id={keyName}
                            placeholder={placeholder}
                            disabled={disabled}
                            type='hidden'
                            {...field}
                            value={field.value ?? ""}
                        />
                    );
                }

                return (
                    <TextField
                        {...field}
                        value={field.value ?? ""}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? null}
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
