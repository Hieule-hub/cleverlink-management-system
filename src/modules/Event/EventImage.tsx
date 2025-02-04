import React from "react";

import { styled } from "@mui/material";
import dayjs from "dayjs";

import { Event } from "@/interfaces/event";

const EventImageStyled = styled("div")`
    width: 182px;
    height: 104px;
    margin: 6px 0;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    position: relative;

    &:hover {
        .time-part {
            opacity: 1;
            bottom: 0;
        }
    }

    .time-part {
        transition: all 0.3s;
        position: absolute;
        bottom: -25px;
        left: 0;
        right: 0;
        opacity: 0;

        background: linear-gradient(
            0deg,
            #000000 0%,
            rgba(0, 0, 0, 0.7) 30%,
            rgba(0, 0, 0, 0.5) 65%,
            rgba(0, 0, 0, 0.1) 100%
        );
        color: #fff;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        line-height: 25px;
    }
`;

export const EventImage = ({ item }: { item: Event }) => {
    return (
        <EventImageStyled
            style={{
                backgroundImage: `url(${item.images[0]}), linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.5) 65%, rgba(0, 0, 0, 0.1) 100%)`
            }}
        >
            <div className='time-part'>{dayjs(item.time).format("YYYY/MM/DD - HH:mm:ss")}</div>
        </EventImageStyled>
    );
};
