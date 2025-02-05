import React, { useEffect, useRef, useState } from "react";

import { PauseCircle, PlayCircle, SkipNext, SkipPrevious } from "@mui/icons-material";
import { Box, Slider, styled } from "@mui/material";
import { IconButton } from "@mui/material";

const ViewPlayerContainer = styled(Box)`
    // handle loading image before playing
    .loading-image {
        opacity: 0;
    }

    position: relative;
    height: 400px;

    :hover {
        .control-bar {
            opacity: 1;
        }
    }

    .view-player {
        position: absolute;
        z-index: 1;
        inset: 0;
        width: 100%;
        height: 400px;
        cursor: pointer;
    }

    .control-bar {
        padding: 0 10px;
        transition: all 0.3s;
        opacity: 0;
        position: absolute;
        z-index: 2;
        padding-bottom: 8px;
        bottom: 0;
        margin-top: auto;
        width: 100%;
        background: linear-gradient(
            0deg,
            #000000 0%,
            rgba(0, 0, 0, 0.7) 30%,
            rgba(0, 0, 0, 0.5) 65%,
            rgba(0, 0, 0, 0.1) 100%
        );
        color: #fff;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        &.paused {
            opacity: 1;
        }
    }

    .control-buttons {
        .btn-control {
            padding: 2px;
        }
    }
`;

export const ViewPlayer = (props) => {
    const { items, onChange = (index) => "", ...otherProps } = props;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (isPlaying) {
            onChange(-1);
        } else {
            onChange(currentIndex);
        }

        if (isPlaying) {
            intervalRef.current = setInterval(handleNextImage, 500);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, currentIndex]);

    const handleNextImage = () => {
        const nextIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(nextIndex);
    };

    const handlePreviousImage = () => {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        setCurrentIndex(prevIndex);
    };

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    if (!items || items.length === 0) return null;

    return (
        <ViewPlayerContainer {...otherProps}>
            <div className='loading-image'>
                {items.map((image, index) => {
                    return (
                        <div key={index}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    border: "3px solid"
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            <div
                className='view-player'
                style={{
                    backgroundImage: `url(${items[currentIndex]}),linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.5) 65%, rgba(0, 0, 0, 0.1) 100%) `,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
                onClick={togglePlayPause}
            />
            <div className={`control-bar` + (isPlaying ? "" : " paused")}>
                <Slider
                    color='error'
                    value={currentIndex}
                    onChange={(e, value) => setCurrentIndex(value as number)}
                    step={1}
                    max={items.length - 1}
                    aria-label='time-line'
                />
                <div className='control-buttons'>
                    <IconButton className='btn-control' color='inherit' onClick={handlePreviousImage}>
                        <SkipPrevious color='inherit' />
                    </IconButton>
                    <IconButton className='btn-control' color='inherit' onClick={togglePlayPause}>
                        {isPlaying ? <PauseCircle color='inherit' /> : <PlayCircle color='inherit' />}
                    </IconButton>
                    <IconButton className='btn-control' color='inherit' onClick={handleNextImage}>
                        <SkipNext color='inherit' />
                    </IconButton>
                </div>
                <div className='timer'>{`
                    ${currentIndex + 1} / ${items?.length}
                `}</div>
            </div>
        </ViewPlayerContainer>
    );
};
