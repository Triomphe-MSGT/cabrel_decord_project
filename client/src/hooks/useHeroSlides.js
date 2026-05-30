import { useState, useEffect } from 'react';
import { heroApi } from '../services/api';

export const useHeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    heroApi
      .getPublic()
      .then(({ data }) => setSlides(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return { slides, loading, error };
};
