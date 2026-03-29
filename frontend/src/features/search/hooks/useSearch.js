import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async (searchQuery) => {
    if (!searchQuery?.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3000/api/search?query=${encodeURIComponent(searchQuery)}`);
      setResults(response.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    refreshSearch: () => fetchResults(query)
  };
};
