// import required modules
import { useRef } from "react";

import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { styled } from "@mui/material";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import { Button } from "../Button";

const ActionButton = styled(Button)`
    border-radius: 50%;
    height: 40px;
    width: 40px;
    flex-shrink: 0;
`;

const SliderContainer = styled("div")`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
`;

interface SliderProps {
    items: any[];
    render: (item: any) => JSX.Element;
}

export const Slider = ({ items, render }: SliderProps) => {
    const swiperRef = useRef<any>();

    return (
        <SliderContainer
            style={{
                opacity: items.length > 0 ? 1 : 0
            }}
        >
            <ActionButton onClick={() => swiperRef.current?.slidePrev()}>
                <KeyboardArrowLeft />
            </ActionButton>
            <Swiper
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                breakpointsBase='container'
                navigation={true}
                breakpoints={{
                    900: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 },
                    1536: { slidesPerView: 4 }
                }}
                modules={[Navigation]}
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index}>{render(item)}</SwiperSlide>
                ))}
            </Swiper>

            <ActionButton onClick={() => swiperRef.current?.slideNext()}>
                <KeyboardArrowRight />
            </ActionButton>
        </SliderContainer>
    );
};
