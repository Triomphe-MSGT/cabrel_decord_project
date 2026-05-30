import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useFeatured } from '../../hooks/useFeatured';
import FeaturedCard from './FeaturedCard';

export default function FeaturedItems() {
  const { section, products, loading, error } = useFeatured();
  const maxItems = section?.maxItems || 6;

  if (loading) {
    return (
      <section className="featured-section featured-section--loading">
        <div className="featured-section__inner">
          <div className="featured-section__header">
            <div className="featured-skeleton featured-skeleton--title" />
            <div className="featured-skeleton featured-skeleton--subtitle" />
          </div>
          <div className={`featured-bento featured-bento--n${maxItems} featured-bento--skeleton`}>
            {Array.from({ length: maxItems }).map((_, i) => (
              <div
                key={i}
                className={`featured-skeleton featured-skeleton--card${i === 0 && maxItems > 1 ? ' featured-skeleton--lead' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !section?.actif || products.length === 0) {
    return null;
  }

  const count = products.length;
  const bentoClass = `featured-bento featured-bento--n${count}`;

  return (
    <section className="featured-section">
      <div className="featured-section__glow" aria-hidden />
      <div className="featured-section__inner">
        <header className="featured-section__header">
          <div className="featured-section__intro">
            <span className="featured-section__kicker">
              <Sparkles size={14} />
              {section.kicker}
            </span>
            <h2 className="featured-section__title">{section.title}</h2>
            {section.subtitle && (
              <p className="featured-section__subtitle">{section.subtitle}</p>
            )}
          </div>
          {section.ctaLabel && section.ctaLink && (
            <Link to={section.ctaLink} className="featured-section__link">
              {section.ctaLabel}
              <ArrowUpRight size={18} />
            </Link>
          )}
        </header>

        {count === 1 ? (
          <div className="featured-bento featured-bento--n1">
            <FeaturedCard product={products[0]} variant="lead" />
          </div>
        ) : (
          <div className={bentoClass}>
            <FeaturedCard product={products[0]} variant="lead" />
            {products.slice(1).map((p) => (
              <FeaturedCard key={p._id} product={p} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
