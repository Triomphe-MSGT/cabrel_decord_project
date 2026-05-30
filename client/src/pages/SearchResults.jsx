import { useSearchParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import { PRODUCTS_PER_PAGE } from '../hooks/useFilter';
import ProductCard from '../components/ui/ProductCard';
import ArtCard from '../components/ui/ArtCard';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import PageTransition from '../components/layout/PageTransition';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const { setQuery, results, loading, error, pagination } = useSearch(q, page);

  useEffect(() => {
    setQuery(q);
  }, [q, setQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const setPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    if (!nextPage || nextPage <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(nextPage));
    }
    setSearchParams(next);
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl mb-6">Recherche</h1>
        <SearchBar defaultValue={q} className="mb-8 max-w-xl" />

        {loading && <p className="opacity-60">Recherche en cours...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && q && (
          <p className="mb-6 text-sm opacity-70">
            {pagination.total} résultat{pagination.total !== 1 ? 's' : ''} pour « {q} »
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {results.map((p) => (
            <div key={p._id}>
              <span className="text-xs uppercase text-cabrel-wood mb-1 block">
                {p.atelier === 'art' ? 'Art' : 'Mobilier'}
              </span>
              {p.atelier === 'art' ? (
                <ArtCard product={p} />
              ) : (
                <ProductCard product={p} />
              )}
            </div>
          ))}
        </div>

        {!loading && q && results.length > 0 && (
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            limit={PRODUCTS_PER_PAGE}
            onPageChange={setPage}
            className="mt-10"
          />
        )}

        {!loading && q && results.length === 0 && (
          <p className="opacity-60">
            Aucun résultat. Essayez d&apos;autres termes ou parcourez{' '}
            <Link to="/mobilier" className="text-cabrel-wood underline">le mobilier</Link>
            {' '}et{' '}
            <Link to="/art" className="text-cabrel-wood underline">l&apos;art</Link>.
          </p>
        )}
      </div>
    </PageTransition>
  );
}
