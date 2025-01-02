import * as React from "react";

import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import dayjs from "dayjs";

import { Button } from "@/components/Button";
import { Event } from "@/interfaces/event";

interface EventCardProps {
    item: Event;
}

const StyledCard = styled(Card)`
    /* max-width: 345; */
    width: 100%;
    box-shadow: none;
    border: 1px solid var(--input-border-color);

    .title {
        font-size: 16px;
        font-weight: 600;
        line-height: 13px;
    }

    .btn {
        box-shadow: 0px 4px 4px 0px #00000026;
        height: 28px;
        font-size: 15px;
        padding: 0 6px 0 8px;
        font-weight: 500;
    }

    .tag {
        background-color: #f1f1f1;
        color: #747b88;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 28px;
        padding: 0 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
`;

export const EventCard = ({ item }: EventCardProps) => {
    console.log("🚀 ~ EventCard ~ item:", item);
    return (
        <StyledCard>
            <CardHeader
                sx={{
                    padding: "14px"
                }}
                action={<div className='tag'>{item.aiCode}</div>}
                title={<div className='title'>{item.device?.place}</div>}
            />
            <CardMedia component='img' height='194' image={item.images[0]} alt='Paella dish' />
            <CardActions
                sx={{
                    height: 48
                }}
            >
                <Button className='btn' color='primary' endIcon={KeyboardArrowRight}>
                    {item.activate.boxId}
                </Button>
                <div className='tag'>{`CH ` + item.channel}</div>
                <div className='tag'>{dayjs(item.time).format("YYYY/MM/DD - HH:mm:ss")}</div>
            </CardActions>
        </StyledCard>
    );
};
