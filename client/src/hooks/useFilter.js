import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const PRODUCTS_PER_PAGE = 10;

const DEFAULT_FILTER = {
  atelier: '',
  categorie: '',
  prixMin: '',
  prixMax: '',
  disponible: '',
  sort: 'recent',
};

export const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const f = { ...DEFAULT_FILTER };
    for (const key of Object.keys(DEFAULT_FILTER)) {
      const val = searchParams.get(key);
      if (val !== null) f[key] = val;
    }
    return f;
  }, [searchParams]);

  const setFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value === '' || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
      next.delete('page');
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setFilters = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      next.delete('page');
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setPage = useCallback(
    (page) => {
      const next = new URLSearchParams(searchParams);
      if (!page || page <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(page));
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categorie) count += 1;
    if (filters.prixMin) count += 1;
    if (filters.prixMax) count += 1;
    if (filters.disponible) count += 1;
    if (filters.sort && filters.sort !== 'recent') count += 1;
    return count;
  }, [filters]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const apiParams = useMemo(() => {
    const params = { limit: PRODUCTS_PER_PAGE, page };
    if (filters.atelier) params.atelier = filters.atelier;
    if (filters.categorie) params.categorie = filters.categorie;
    if (filters.prixMin) params.prixMin = filters.prixMin;
    if (filters.prixMax) params.prixMax = filters.prixMax;
    if (filters.disponible) params.disponible = filters.disponible;
    if (filters.sort) params.sort = filters.sort;
    return params;
  }, [filters, page]);

  return { filters, setFilter, setFilters, apiParams, page, setPage, resetFilters, activeFilterCount };
};
