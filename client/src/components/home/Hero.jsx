import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y, EffectFade } from 'swiper/modules';
import { ArrowUpRight } from 'lucide-react';
import { useHeroSlides } from '../../hooks/useHeroSlides';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Hero() {
  const { slides, loading, error } = useHeroSlides();
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [slides]);

  if (loading) {
    return (
      <section className="hero-showcase">
        <div className="hero-showcase-wrap hero-showcase-wrap--loading">
          <p className="text-sm text-cabrel-dark/50 p-10 text-center">Chargement...</p>
        </div>
      </section>
    );
  }

  if (error || !slides.length) {
    return (
      <section className="hero-showcase">
        <div className="hero-showcase-wrap hero-showcase-wrap--loading">
          <p className="text-sm text-cabrel-dark/50 p-10 text-center">
            {error || 'Aucun slide hero configuré.'}
          </p>
        </div>
      </section>
    );
  }

  const current = slides[active] || slides[0];

  return (
    <section className="hero-showcase">
      <div className="hero-showcase-wrap">
        <div className="hero-showcase-grid">
          <div className="hero-showcase-visual">
            <Swiper
              modules={[Autoplay, Pagination, A11y, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={600}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true, el: '.hero-showcase-pagination' }}
              loop={slides.length > 1}
              onSlideChange={(s) => setActive(s.realIndex)}
              className="hero-showcase-swiper h-full w-full"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide._id}>
                  <img src={resolveMediaUrl(slide.mainImage)} alt="" className="hero-showcase-img" />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="hero-showcase-overlay" aria-hidden />

            {current.insetImage && (
              <div className="hero-showcase-inset">
                <img
                  src={resolveMediaUrl(current.insetImage)}
                  alt=""
                  className="hero-showcase-inset-img"
                />
              </div>
            )}

            <span className="hero-showcase-counter">
              {String(active + 1).padStart(2, '0')}
              <span className="opacity-40 mx-1">/</span>
              {String(slides.length).padStart(2, '0')}
            </span>

            <div className="hero-showcase-pagination" />
          </div>

          <div className="hero-showcase-content">
            <div className="hero-showcase-content-inner" key={current._id}>
              <span className="hero-showcase-kicker">{current.kicker}</span>
              <h2 className="hero-showcase-title">{current.title}</h2>
              <p className="hero-showcase-name">{current.name}</p>
              <p className="hero-showcase-desc">{current.description}</p>

              <div className="hero-showcase-footer">
                {current.badge && (
                  <span className="hero-showcase-badge">{current.badge}</span>
                )}
                <Link to={current.ctaLink} className="hero-showcase-cta">
                  {current.ctaLabel}
                  <ArrowUpRight size={17} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
