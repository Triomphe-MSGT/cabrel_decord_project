import { useState, useEffect, useCallback } from 'react';
import { featuredApi } from '../services/api';

export const useFeatured = () => {
  const [section, setSection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await featuredApi.getPublic();
      setSection(data.section);
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { section, products, loading, error, refetch: fetchFeatured };
};
