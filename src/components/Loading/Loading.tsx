"use client";

import React from "react";

import { styled } from "@mui/material";

const StyledLoading = styled("div")<LoadingProps>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #efefff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--modal-z-index) + 1;

    .loading-box {
        position: relative;

        ::before {
            content: attr(data-title);
            color: white;
            font-size: 35px;
            font-weight: 700;
            opacity: 1;
            white-space: nowrap;
        }

        ::after {
            position: absolute;
            overflow: hidden;
            top: 0;
            left: 0;
            bottom: 0;
            content: attr(data-title);
            color: var(--primary-color);
            font-size: 35px;
            font-weight: 700;
            opacity: 1;
            white-space: nowrap;
            animation: reveal 2.5s linear forwards;
        }
    }

    @keyframes reveal {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }
`;

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

export const Loading = ({ title = "CLEVER-LINK SYSTEM", ...props }: LoadingProps) => {
    return (
        <StyledLoading {...props}>
            <div className='loading-box' data-title={title} />
        </StyledLoading>
    );
};
