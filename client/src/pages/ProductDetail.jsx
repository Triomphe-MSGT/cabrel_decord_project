import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { slugify } from '../utils/slug';
import ProductDetailContent from './ProductDetailContent';

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading, error } = useProducts({}); // fetch all products
  if (loading) return <p className="text-center py-20 opacity-60">Chargement...</p>;
  if (error) return <p className="text-center py-20 text-red-600">Erreur de chargement</p>;

  const product = products.find(p => slugify(p.titre) === slug);
  if (!product) {
    // If not found, redirect to home (or show 404)
    return <p className="text-center py-20 text-red-600">Produit introuvable</p>;
  }

  return <ProductDetailContent product={product} />;
}