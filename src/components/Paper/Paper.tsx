import React from "react";

import { styled } from "@mui/material";

const StyledPaper = styled("div")`
    background-color: #fff;
    border-radius: 20px;
    border: 1px solid #eaecf0;
    margin-top: 20px;

    .header {
        height: 70px;
        display: flex;
        padding: 0 20px;
        justify-content: space-between;
        border-bottom: 1px solid #eaecf0;
        align-items: center;

        .title {
            font-size: 22px;
            font-weight: 700;
        }
    }

    .body {
        padding: 20px;
    }
`;

interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    extra?: React.ReactNode;
    title?: string;
}

export const Paper = ({ children, title, extra = "", ...props }: PaperProps) => {
    return (
        <StyledPaper {...props}>
            <div className='header'>
                <div className='title'>{title}</div>
                {extra}
            </div>
            <div className='body'>{children}</div>
        </StyledPaper>
    );
};
