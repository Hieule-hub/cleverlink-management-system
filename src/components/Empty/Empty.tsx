import React from "react";

import { styled } from "@mui/material";

const StyledEmpty = styled("div")`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    color: ${({ theme }) => theme.palette.text.secondary};

    .empty-img {
        width: 10%;
        opacity: 0.8;
        max-width: 80px;
    }

    p {
        font-size: 0.875rem;
    }
`;

export const Empty = ({ title = "", ...props }) => {
    return (
        <StyledEmpty {...props}>
            <img className='empty-img' src={"/assets/images/empty.png"} alt='/assets/images/empty.png' />
            <p>{title}</p>
        </StyledEmpty>
    );
};
