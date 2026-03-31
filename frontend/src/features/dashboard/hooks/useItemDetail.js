import { useState, useCallback } from 'react';
import { 
  fetchItemById, 
  fetchRelatedItems, 
  fetchHighlights, 
  addHighlight as apiAddHighlight, 
  deleteHighlight as apiDeleteHighlight 
} from '../services/dashboard.api';

export const useItemDetail = () => {
  const [item, setItem] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItemDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const [itemData, relatedData, highlightData] = await Promise.all([
        fetchItemById(id),
        fetchRelatedItems(id),
        fetchHighlights(id)
      ]);
      setItem(itemData);
      setRelatedItems(relatedData.related || []);
      setHighlights(highlightData || []);
    } catch (err) {
      setError(err.message || 'Failed to sync with your memory.');
      console.error('Error loading item detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addHighlight = async (text, note = "") => {
    if (!item?._id) return;
    try {
      const newHighlight = await apiAddHighlight({
        itemId: item._id,
        text,
        note
      });
      setHighlights(prev => [newHighlight, ...prev]);
      return newHighlight;
    } catch (err) {
      console.error('Error adding highlight:', err);
      throw err;
    }
  };

  const removeHighlight = async (id) => {
    try {
      await apiDeleteHighlight(id);
      setHighlights(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      console.error('Error deleting highlight:', err);
      throw err;
    }
  };

  const updateItemData = async (id, data) => {
    try {
      const { updateItem } = await import('../services/dashboard.api');
      const updatedItem = await updateItem(id, data);
      setItem(updatedItem);
      return updatedItem;
    } catch (err) {
      console.error('Error updating item:', err);
      throw err;
    }
  };

  const editHighlight = async (id, note) => {
    try {
      // Assuming api has an updateHighlight method (adding it now to api service just in case)
      const { updateHighlight: apiUpdateHighlight } = await import('../services/dashboard.api');
      const updated = await apiUpdateHighlight(id, { note });
      setHighlights(prev => prev.map(h => h._id === id ? updated : h));
      return updated;
    } catch (err) {
      console.error('Error updating highlight:', err);
      throw err;
    }
  };

  return {
    item,
    highlights,
    relatedItems,
    loading,
    error,
    loadItemDetail,
    addHighlight,
    removeHighlight,
    editHighlight,
    updateItemData
  };
};
