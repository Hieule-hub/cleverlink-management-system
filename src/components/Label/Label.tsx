import React from "react";

import { Typography, styled } from "@mui/material";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    label: string;
    required?: boolean;
    align?: "left" | "center" | "right";
}

const StyledLabel = styled("label")`
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: #667085;
    position: relative;

    /* .required {
        color: red;
        position: absolute;
        top: 0;
        left: -10px;
        line-height: 1;
    } */
`;

export const Label = ({ label, required, align = "left", ...props }: LabelProps) => {
    return (
        <StyledLabel {...props}>
            <Typography
                sx={{
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    position: "relative",
                    ".required": {
                        color: "red",
                        position: "absolute",
                        top: 0,
                        left: "-10px",
                        lineHeight: 1
                    }
                }}
                align={align}
                noWrap
            >
                {label}
                {required && <span className='required'>*</span>}
            </Typography>
        </StyledLabel>
    );
};
