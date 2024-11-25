import { TextField as InputMUI, TextFieldProps, styled } from "@mui/material";
import { colorsFormControl } from "@configs/theme";

const StyledInput = styled(InputMUI)`
    &:hover {
        .MuiInputBase-input {
            border: 1px solid ${colorsFormControl.borderHoverColor};
        }
    }

    &:after,
    &:before {
        /* border: none !important; */
    }

    &.Mui-focused {
        /* .MuiInputBase-input {
			border: 1px solid ${colorsFormControl.borderFocusColor};
		} */
    }

    .MuiInputBase-input {
        transition: all 0.3s ease;
        padding: 8px 12px;
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
`;

export const InputMui = ({ ...props }: TextFieldProps) => {
    return <StyledInput {...props} />;
};
