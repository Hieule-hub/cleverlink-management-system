import React from "react";

import { Typography, styled } from "@mui/material";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    label: string;
    required?: boolean;
}

const StyledLabel = styled("label")`
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: #667085;
    position: relative;

    .required {
        color: red;
        position: absolute;
        top: 0;
        left: -10px;
        line-height: 1;
    }
`;

export const Label = ({ label, required, ...props }: LabelProps) => {
    return (
        <StyledLabel {...props}>
            <Typography
                sx={{
                    fontSize: "inherit",
                    fontWeight: "inherit"
                }}
                noWrap
            >
                {label}
            </Typography>
            {required && <span className='required'>*</span>}
        </StyledLabel>
    );
};
