import { TextField as InputMUI, TextFieldProps, styled } from "@mui/material";

const StyledInput = styled(InputMUI)`
    &:hover {
        .MuiInputBase-input {
            border-color: var(--palette-primary-main);
        }
    }

    .MuiInputBase-input {
        transition: all 0.3s ease;
        padding: 8px 12px;
        border: 1px solid;
        border-color: var(--input-border-color);
        color: var(--input-color);
        border-radius: var(--input-border-radius);
        font-size: var(--input-font-size);
        box-sizing: border-box;
        height: var(--input-height);
    }

    .MuiOutlinedInput-notchedOutline {
        border: none;
    }
`;

export const InputMui = ({ ...props }: TextFieldProps) => {
    return <StyledInput {...props} />;
};
