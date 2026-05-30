import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import ProductImageHover from '../ui/ProductImageHover';

export default function FeaturedCard({ product, variant = 'compact' }) {
  const path = product.atelier === 'art' ? `/art/${product._id}` : `/mobilier/${product._id}`;
  const categorie = product.categorie_mobilier || product.categorie_art;
  const isLead = variant === 'lead';

  return (
    <Link to={path} className={`featured-card featured-card--${variant} group`}>
      <div className="featured-card__visual">
        <ProductImageHover
          images={product.images}
          alt={product.titre}
          aspect={isLead ? '4/3' : product.atelier === 'art' ? '1/1' : '4/3'}
        />
        <span className="featured-card__badge">
          {product.atelier === 'art' ? 'Art' : 'Mobilier'}
        </span>
        {isLead && <span className="featured-card__spotlight">Coup de cœur</span>}
      </div>
      <div className="featured-card__body">
        <p className="featured-card__category">{categorie}</p>
        <h3 className="featured-card__title">{product.titre}</h3>
        {product.dimensions && (
          <p className="featured-card__meta">{product.dimensions}</p>
        )}
        <div className="featured-card__footer">
          <p className="featured-card__price">{formatPrice(product.prix)}</p>
          <span className="featured-card__cta">
            Voir
            <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
