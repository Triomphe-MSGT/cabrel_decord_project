import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ui/ProductCard';

export default function AtelierPreview() {
  const { products, loading, error } = useProducts({ limit: 6 });

  if (loading) {
    return (
      <section className="section-block">
        <div className="section-block__inner">
          <h2 className="section-block__title">Nos réalisations</h2>
          <p className="section-block__subtitle">
            Survolez une image pour découvrir le produit en situation.
          </p>
          <p className="text-sm opacity-60">Chargement...</p>
        </div>
      </section>
    );
  }

  if (error || !products.length) {
    return (
      <section className="section-block">
        <div className="section-block__inner">
          <h2 className="section-block__title">Nos réalisations</h2>
          <p className="section-block__subtitle">
            Survolez une image pour découvrir le produit en situation.
          </p>
          <p className="text-sm opacity-60">
            {error || 'Aucune réalisation disponible.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block">
      <div className="section-block__inner">
        <h2 className="section-block__title">Nos réalisations</h2>
        <p className="section-block__subtitle">
          Survolez une image pour découvrir le produit en situation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} className="product-card hover:scale-[1.02] transition-transform duration-300" />
          ))}
        </div>
        <Link to="/produits" className="atelier-preview-link">
          Voir tous les produits →
        </Link>
      </div>
    </section>
  );
}