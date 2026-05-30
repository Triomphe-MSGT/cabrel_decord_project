import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useFilter, PRODUCTS_PER_PAGE } from '../hooks/useFilter';
import ArtCard from '../components/ui/ArtCard';
import AtelierLayout from '../components/atelier/AtelierLayout';

export default function Art() {
  const { filters, setFilter, apiParams, page, setPage, resetFilters, activeFilterCount } = useFilter();
  const params = { ...apiParams, atelier: 'art' };
  const { products, loading, error, pagination } = useProducts(params);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <AtelierLayout
      atelier="art"
      CardComponent={ArtCard}
      products={products}
      loading={loading}
      error={error}
      pagination={pagination}
      filters={filters}
      setFilter={setFilter}
      resetFilters={resetFilters}
      activeFilterCount={activeFilterCount}
      page={page}
      setPage={setPage}
      productsPerPage={PRODUCTS_PER_PAGE}
    />
  );
}
