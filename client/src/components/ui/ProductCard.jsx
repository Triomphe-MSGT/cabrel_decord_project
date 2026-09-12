import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import ProductImageHover from './ProductImageHover';
import { slugify } from '../../utils/slug';

export default function ProductCard({ product }) {
  const categorie = product.categorie_mobilier || product.categorie_art;
  const productSlug = slugify(product.titre);

  return (
    <Link
      to={`/produits/${productSlug}`}
      className="product-card group"
    >
      <ProductImageHover images={product.images} alt={product.titre} aspect="4/3" />
      <div className="product-card__body">
        <p className="product-card__category">{categorie}</p>
        <h3 className="product-card__title">{product.titre}</h3>
        <p className="product-card__price">{formatPrice(product.prix)}</p>
        {!product.disponible && (
          <span className="product-card__status">Indisponible</span>
        )}
      </div>
    </Link>
  );
}
