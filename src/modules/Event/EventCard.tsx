import * as React from "react";

import { Button } from "@components/Button";
import { Event } from "@interfaces/event";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

interface EventCardProps {
    item: Event;
    onDoubleClickImage?: () => void;
    onClickButton?: () => void;
}

const StyledCard = styled(Card)`
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

    .image-part {
        position: relative;
        overflow: hidden;

        &:hover {
            .time-part {
                opacity: 1;
                bottom: 0;
            }
        }
    }

    .time-part {
        transition: all 0.3s;
        position: absolute;
        bottom: -40px;
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
        line-height: 40px;
    }
`;

export const EventCard = ({ item, onDoubleClickImage = () => "", onClickButton = () => "" }: EventCardProps) => {
    const tAiCode = useTranslations("AiCode");
    console.log("🚀 ~ item => ", item);

    return (
        <StyledCard>
            <CardHeader
                sx={{
                    padding: "14px"
                }}
                action={<div className='tag'>{`CH ` + item.channel}</div>}
                title={<div className='title'>{item.device?.place}</div>}
            />
            <div className='image-part'>
                <CardMedia
                    onDoubleClick={onDoubleClickImage}
                    component='img'
                    height='194'
                    sx={{
                        cursor: "pointer"
                    }}
                    onError={
                        ((e) => {
                            e.target.src = "/assets/images/noImage.jpg";
                        }) as any
                    }
                    image={item.images[0]}
                    alt='Snapshot image'
                />
                <div className='time-part'>{dayjs(item.time).format("YYYY/MM/DD - HH:mm:ss")}</div>
            </div>

            <CardActions
                sx={{
                    height: 48
                }}
            >
                <div className='tag'>{tAiCode(item.aiCode)}</div>
                <div className='tag'>{item.notifyCode}</div>
                {/* <div className='tag'>{dayjs(item.time).format("YYYY/MM/DD - HH:mm:ss")}</div> */}
                <Button
                    style={{
                        marginLeft: "auto"
                    }}
                    className='btn'
                    color='primary'
                    endIcon={KeyboardArrowRight}
                    onClick={onClickButton}
                >
                    {item.activate?.boxId}
                </Button>
            </CardActions>
        </StyledCard>
    );
};
