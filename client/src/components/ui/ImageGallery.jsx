import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function ImageGallery({ images = [], title = '' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="product-gallery product-gallery--empty">
        Aucune image
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        className="product-gallery__main"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src}>
            <div className="product-gallery__slide">
              <img src={resolveMediaUrl(src)} alt={title ? `${title} — vue ${i + 1}` : ''} />
              <span className="product-gallery__counter">
                {i + 1} / {images.length}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <p className="product-gallery__legend">
            {activeIndex === 0
              ? 'Vue principale'
              : activeIndex === 1
                ? 'Vue en situation'
                : `Angle ${activeIndex + 1}`}
          </p>
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={4}
            watchSlidesProgress
            className="product-gallery__thumbs"
            breakpoints={{
              640: { slidesPerView: 5 },
            }}
          >
            {images.map((src, i) => (
              <SwiperSlide key={`thumb-${src}`} className="product-gallery__thumb">
                <img src={resolveMediaUrl(src)} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
}
