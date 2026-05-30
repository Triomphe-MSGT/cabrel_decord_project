import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ui/ProductCard';
import ArtCard from '../ui/ArtCard';

export default function FeaturedItems() {
  const { products, loading, error } = useProducts({ enVedette: true, limit: 6 });

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="font-serif text-2xl text-center mb-10">À la une</h2>
      {loading && <p className="text-center opacity-60">Chargement...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center opacity-60">Aucun produit en vedette pour le moment.</p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) =>
          p.atelier === 'art' ? (
            <ArtCard key={p._id} product={p} />
          ) : (
            <ProductCard key={p._id} product={p} />
          )
        )}
      </div>
    </section>
  );
}
