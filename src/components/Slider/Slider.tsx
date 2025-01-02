// import required modules
import { Box } from "@mui/material";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

interface SliderProps {
    items: any[];
    render: (item: any) => JSX.Element;
}

export const Slider = ({ items, render }: SliderProps) => {
    return (
        <Box sx={{ width: "100%", maxWidth: "1536px", overflow: "hidden" }}>
            <Swiper
                style={{
                    marginTop: "16px"
                }}
                spaceBetween={10}
                centeredSlides={true}
                loop={true}
                navigation={true}
                breakpoints={{
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 3 },
                    640: { slidesPerView: 4 }
                }}
                modules={[Navigation]}
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index}>{render(item)}</SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};
