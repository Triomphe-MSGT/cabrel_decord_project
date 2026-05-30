import { useSearchParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import ProductCard from '../components/ui/ProductCard';
import ArtCard from '../components/ui/ArtCard';
import SearchBar from '../components/ui/SearchBar';
import PageTransition from '../components/layout/PageTransition';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const { query, setQuery, results, loading, error } = useSearch(q);

  useEffect(() => {
    setQuery(q);
  }, [q, setQuery]);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl mb-6">Recherche</h1>
        <SearchBar defaultValue={q} className="mb-8 max-w-xl" />

        {loading && <p className="opacity-60">Recherche en cours...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && q && (
          <p className="mb-6 text-sm opacity-70">
            {results.length} résultat{results.length !== 1 ? 's' : ''} pour « {q} »
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
