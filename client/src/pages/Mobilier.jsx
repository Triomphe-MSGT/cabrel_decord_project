import { useProducts } from '../hooks/useProducts';
import { useFilter } from '../hooks/useFilter';
import ProductCard from '../components/ui/ProductCard';
import FilterPanel from '../components/ui/FilterPanel';
import PageTransition from '../components/layout/PageTransition';

export default function Mobilier() {
  const { filters, setFilter, apiParams } = useFilter();
  const params = { ...apiParams, atelier: 'mobilier' };
  const { products, loading, error } = useProducts(params);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl mb-8">Mobilier</h1>
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <FilterPanel atelier="mobilier" filters={filters} setFilter={setFilter} />
          <div>
            {loading && <p className="opacity-60">Chargement...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {!loading && products.length === 0 && (
              <p className="opacity-60">Aucun produit trouvé.</p>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
