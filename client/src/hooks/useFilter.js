import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

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

  const apiParams = useMemo(() => {
    const params = {};
    if (filters.atelier) params.atelier = filters.atelier;
    if (filters.categorie) params.categorie = filters.categorie;
    if (filters.prixMin) params.prixMin = filters.prixMin;
    if (filters.prixMax) params.prixMax = filters.prixMax;
    if (filters.disponible) params.disponible = filters.disponible;
    if (filters.sort) params.sort = filters.sort;
    const page = searchParams.get('page');
    if (page) params.page = page;
    return params;
  }, [filters, searchParams]);

  return { filters, setFilter, setFilters, apiParams };
};
