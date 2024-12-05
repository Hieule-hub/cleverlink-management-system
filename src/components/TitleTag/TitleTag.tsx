import React from "react";

import { Typography, styled } from "@mui/material";

const StyledTitleTag = styled("div")`
    font-size: 20px;
    font-weight: bold;
    color: white;
    height: 45px;
    min-width: 100px;
    background: var(--palette-primary-main);
    border-radius: 45px;
    line-height: 45px;
    box-shadow: 0px 4px 4px 0px #00000040;
    text-align: center;
    padding: 0 16px;
`;

interface TitleTagProps {
    title?: string;
}

export const TitleTag = ({ title }: TitleTagProps) => {
    return (
        <StyledTitleTag>
            <Typography variant='h6' noWrap fontWeight={"bold"} lineHeight={"45px"}>
                {title}
            </Typography>
        </StyledTitleTag>
    );
};
