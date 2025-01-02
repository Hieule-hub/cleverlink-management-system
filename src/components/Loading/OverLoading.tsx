"use client";

import React from "react";

import { styled } from "@mui/material";

import { useAppStore } from "@/providers/AppStoreProvider";

const StyledOverLoading = styled("div")<OverLoadingProps>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #efefff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: calc(var(--drawer-z-index) + 2);
    pointer-events: none;
    animation: firstLoad 0.2s linear forwards;
    animation-delay: 3s;

    .loading-box {
        position: relative;

        ::before {
            content: attr(data-title);
            color: white;
            font-size: 35px;
            font-weight: 700;
            opacity: 1;
            white-space: nowrap;
            z-index: 1;
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
            z-index: 1;
        }
    }

    @keyframes firstLoad {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
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

interface OverLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

export const OverLoading = ({ title = "CLEVER-LINK SYSTEM", ...props }: OverLoadingProps) => {
    // const isFetching = useAppStore((state) => state.isFetching);

    return (
        <StyledOverLoading {...props}>
            <div className='loading-box' data-title={title} />
        </StyledOverLoading>
    );
};
