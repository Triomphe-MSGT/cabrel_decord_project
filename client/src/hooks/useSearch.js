import { useState, useEffect, useRef } from 'react';
import { productsApi } from '../services/api';
import { PRODUCTS_PER_PAGE } from './useFilter';

export const useSearch = (initialQuery = '', page = 1) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setPagination({ total: 0, page: 1, pages: 1 });
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await productsApi.getAll({
          q: query,
          page,
          limit: PRODUCTS_PER_PAGE,
        });
        setResults(data.products || data);
        if (data.total !== undefined) {
          setPagination({ total: data.total, page: data.page, pages: data.pages });
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, page]);

  return { query, setQuery, results, loading, error, pagination };
};
