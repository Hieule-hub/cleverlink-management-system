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
`;

export const Label = ({ label, required, align = "left", ...props }: LabelProps) => {
    return (
        <StyledLabel {...props}>
            <Typography
                sx={{
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    position: "relative",
                    "&:before ": {
                        content: required ? '"*"' : '""',
                        color: "var(--palette-error-main)"
                    }
                }}
                align={align}
                noWrap
            >
                {label}
            </Typography>
        </StyledLabel>
    );
};
