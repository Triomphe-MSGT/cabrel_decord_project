import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

export default function ImageGallery({ images = [] }) {
  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-cabrel-cream rounded-xl flex items-center justify-center text-cabrel-dark/40">
        Aucune image
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Zoom]}
      navigation
      pagination={{ clickable: true }}
      zoom
      className="rounded-xl overflow-hidden"
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <div className="swiper-zoom-container aspect-[4/3] bg-cabrel-cream">
            <img src={src} alt="" className="w-full h-full object-contain" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
