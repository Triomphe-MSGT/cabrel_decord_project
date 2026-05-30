import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useFilter, PRODUCTS_PER_PAGE } from '../hooks/useFilter';
import ProductCard from '../components/ui/ProductCard';
import AtelierLayout from '../components/atelier/AtelierLayout';

export default function Mobilier() {
  const { filters, setFilter, apiParams, page, setPage, resetFilters, activeFilterCount } = useFilter();
  const params = { ...apiParams, atelier: 'mobilier' };
  const { products, loading, error, pagination } = useProducts(params);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <AtelierLayout
      atelier="mobilier"
      CardComponent={ProductCard}
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
