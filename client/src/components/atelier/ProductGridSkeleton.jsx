import { PRODUCTS_PER_PAGE } from '../../hooks/useFilter';

export default function ProductGridSkeleton({ atelier = 'mobilier' }) {
  return (
    <div className={`atelier-grid${atelier === 'art' ? ' atelier-grid--art' : ''}`} aria-hidden>
      {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
        <div key={i} className="atelier-skeleton">
          <div className={`atelier-skeleton__img${atelier === 'art' ? ' atelier-skeleton__img--square' : ''}`} />
          <div className="atelier-skeleton__line atelier-skeleton__line--short" />
          <div className="atelier-skeleton__line" />
          <div className="atelier-skeleton__line atelier-skeleton__line--price" />
        </div>
      ))}
    </div>
  );
}
