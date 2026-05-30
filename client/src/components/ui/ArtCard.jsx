import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import ProductImageHover from './ProductImageHover';

export default function ArtCard({ product }) {
  const categorie = product.categorie_art;

  return (
    <Link
      to={`/art/${product._id}`}
      className="product-card group"
    >
      <ProductImageHover images={product.images} alt={product.titre} aspect="1/1" />
      <div className="product-card__body">
        <p className="product-card__category">{categorie}</p>
        <h3 className="product-card__title">{product.titre}</h3>
        {product.dimensions && (
          <p className="product-card__meta">{product.dimensions}</p>
        )}
        <p className="product-card__price">{formatPrice(product.prix)}</p>
      </div>
    </Link>
  );
}
