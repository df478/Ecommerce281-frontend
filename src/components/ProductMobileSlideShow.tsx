"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "../../src/styles/slideshow.css";
import { withCoalescedInvoke } from "next/dist/lib/coalesced-function";

interface Props {
  images: string;
  title: string;
  className?: string;
}

export const ProductMobileSlideShow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{
          width: '100vw',
          height: '500px'
        }}
        pagination
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        <SwiperSlide>
          <Image
            width={600}
            height={500}
            src={images}
            alt={title}
            className="  object-fill"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width={600}
            height={500}
            src={images}
            alt={title}
            className="  object-fill"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width={600}
            height={500}
            src={images}
            alt={title}
            className="  object-fill"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
