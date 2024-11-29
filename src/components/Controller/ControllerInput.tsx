import TextField, { TextFieldProps } from "@mui/material/TextField";
import { type Control, Controller as ControllerRHF, type UseControllerProps } from "react-hook-form";

interface ControllerProps {
    keyName?: string;
    placeholder?: string;
    inputProps?: TextFieldProps;
    control: Control<any>;
}

export const ControllerInput = ({ keyName, control, placeholder, inputProps }: ControllerProps) => {
    return (
        <ControllerRHF
            control={control}
            name={keyName}
            render={({ field }) => (
                <TextField {...field} id={keyName} placeholder={placeholder} fullWidth {...inputProps} />
            )}
        />
    );
};
