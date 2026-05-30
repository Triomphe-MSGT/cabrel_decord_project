import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

export default function ArtCard({ product }) {
  const image = product.images?.[0] || '/assets/placeholder-art.jpg';
  const categorie = product.categorie_art;

  return (
    <Link
      to={`/art/${product._id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-cabrel-wood/10"
    >
      <div className="aspect-square overflow-hidden bg-cabrel-cream">
        <img
          src={image}
          alt={product.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-cabrel-wood">{categorie}</p>
        <h3 className="font-serif text-lg mt-1">{product.titre}</h3>
        {product.dimensions && (
          <p className="text-sm text-cabrel-dark/60 mt-1">{product.dimensions}</p>
        )}
        <p className="text-cabrel-wood font-semibold mt-2">{formatPrice(product.prix)}</p>
      </div>
    </Link>
  );
}
