import { useState, useCallback } from 'react';
import { fetchItemById, fetchRelatedItems } from '../services/dashboard.api';

export const useItemDetail = () => {
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItemDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const [itemData, relatedData] = await Promise.all([
        fetchItemById(id),
        fetchRelatedItems(id)
      ]);
      setItem(itemData);
      setRelatedItems(relatedData.related || []);
    } catch (err) {
      setError(err.message || 'Failed to sync with your memory.');
      console.error('Error loading item detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    item,
    relatedItems,
    loading,
    error,
    loadItemDetail
  };
};
