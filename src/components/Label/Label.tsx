import React from "react";

import { styled } from "@mui/material";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    label: string;
    required?: boolean;
}

const StyledLabel = styled("label")`
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: #667085;

    .required {
        color: red;
    }
`;

export const Label = ({ label, required, ...props }: LabelProps) => {
    return (
        <StyledLabel {...props}>
            {label}
            {required && <span className='required'>*</span>}
        </StyledLabel>
    );
};
