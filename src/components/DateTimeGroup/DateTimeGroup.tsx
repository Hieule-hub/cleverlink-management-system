"use client";

import { useEffect, useState } from "react";

import { AccessTime } from "@mui/icons-material";
import { Box, BoxProps, Typography as MuiTypography, styled } from "@mui/material";

const Typography = styled(MuiTypography)`
    font-weight: 600;
    font-size: 0.8rem;
`;

export const DateTimeGroup = (props: BoxProps) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    // const t = useTranslations();

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup the timer on unmount
    }, []);

    // Format the date, time, and day
    const formatDate = currentTime.toLocaleDateString("en-CA"); // YYYY.MM.DD
    const formatTime = currentTime.toLocaleTimeString(); // HH:MM:SS
    // const formatDay = currentTime.toLocaleDateString("en-US", {
    //     weekday: "short"
    // }); // Mon, Tue, etc.

    return (
        <Box
            marginRight={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            // gap={1}
            color={"black"}
            {...props}
        >
            {/* Render the icon to the left */}
            <AccessTime
                sx={{
                    fontSize: 18,
                    marginRight: 1
                }}
            />

            <Typography variant='body1' noWrap marginRight={1}>
                {formatDate}
            </Typography>
            <Typography variant='body1' noWrap marginRight={1}>
                {/* ({t(formatDay)}) */}
            </Typography>
            <Typography variant='body1' noWrap width={50} marginRight={"1px"}>
                {formatTime.split(" ")[0]}
            </Typography>
            <Typography variant='body1' noWrap>
                {formatTime.split(" ")[1]}
            </Typography>
        </Box>
    );
};
