import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

export default function ProductCard({ product }) {
  const image = product.images?.[0] || '/assets/placeholder-mobilier.jpg';
  const categorie = product.categorie_mobilier || product.categorie_art;

  return (
    <Link
      to={`/mobilier/${product._id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-cabrel-wood/10"
    >
      <div className="aspect-[4/3] overflow-hidden bg-cabrel-cream">
        <img
          src={image}
          alt={product.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-cabrel-wood">{categorie}</p>
        <h3 className="font-serif text-lg mt-1">{product.titre}</h3>
        <p className="text-cabrel-wood font-semibold mt-2">{formatPrice(product.prix)}</p>
        {!product.disponible && (
          <span className="inline-block mt-2 text-xs text-red-600">Indisponible</span>
        )}
      </div>
    </Link>
  );
}
