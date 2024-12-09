import React from "react";

import { Typography, styled } from "@mui/material";

const StyledTitleTag = styled("div")`
    font-size: 20px;
    font-weight: bold;
    color: #667085;
    background: white;
    height: 45px;
    min-width: 100px;
    border-radius: 45px;
    line-height: 45px;
    box-shadow: 0px 4px 4px 0px #00000040;
    text-align: center;
    padding: 0 16px;

    &.primary {
        background: var(--palette-primary-main);
        color: white;
    }

    &.default {
        background: white;
        color: #667085;
        border: 1px solid var(--input-border-color);
    }
`;

interface TitleTagProps {
    title?: string;
    color?: "primary" | "default";
}

export const TitleTag = ({ title, color = "primary" }: TitleTagProps) => {
    return (
        <StyledTitleTag className={color}>
            <Typography variant='h6' noWrap fontWeight={"bold"} lineHeight={"45px"}>
                {title}
            </Typography>
        </StyledTitleTag>
    );
};
