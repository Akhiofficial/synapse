import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCollections } from '../services/collections.api';

export const CollectionsContext = createContext();

const getVisualProps = (id, index) => {
  const themes = [
    { icon: 'groups', color: 'bg-orange-500/20', iconColor: 'text-orange-500' },
    { icon: 'layers', color: 'bg-blue-500/20', iconColor: 'text-blue-500' },
    { icon: 'palette', color: 'bg-purple-500/20', iconColor: 'text-purple-500' },
    { icon: 'bolt', color: 'bg-yellow-500/20', iconColor: 'text-yellow-500' },
    { icon: 'science', color: 'bg-green-500/20', iconColor: 'text-green-500' },
    { icon: 'public', color: 'bg-pink-500/20', iconColor: 'text-pink-500' },
    { icon: 'architecture', color: 'bg-cyan-500/20', iconColor: 'text-cyan-500' },
  ];
  return themes[index % themes.length];
};

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] = useState(false);

  const loadCollections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCollections();
      if (response && response.collections) {
        const mappedCollections = response.collections.map((col, idx) => ({
          id: col._id,
          title: col.name,
          description: `Created on ${new Date(col.createdAt).toLocaleDateString()}`,
          itemCount: col.itemCount || 0,
          ...getVisualProps(col._id, idx),
          isPriority: idx === 0,
          raw: col
        }));
        setCollections(mappedCollections);
      }

      // Load actual recent items from the user's dashboard API
      const { fetchRecentItems } = await import('../../dashboard/services/dashboard.api');
      const items = await fetchRecentItems();
      if (items && items.length) {
        const mappedItems = items.map(item => ({
          id: item._id,
          title: item.title,
          type: item.type.toUpperCase(),
          timestamp: new Date(item.createdAt).toLocaleDateString(),
          thumbnail: item.metadata?.imageUrl || item.metadata?.thumbnailUrl || null,
          tags: item.tags || []
        }));
        setRecentItems(mappedItems);
      } else {
        setRecentItems([]);
      }
    } catch (err) {
      console.error('Failed to load collections:', err);
      setError(err.message || 'Error loading collections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const addCollection = (newCollection) => {
    setCollections(prev => [{
      id: newCollection._id,
      title: newCollection.name,
      description: `Created on ${new Date(newCollection.createdAt).toLocaleDateString()}`,
      itemCount: 0,
      ...getVisualProps(newCollection._id, prev.length),
      isPriority: false,
      raw: newCollection
    }, ...prev]);
  };

  const filterItems = async (type) => {
    try {
      const { fetchRecentItems } = await import('../../dashboard/services/dashboard.api');
      let items = await fetchRecentItems();
      
      if (type !== 'All Types') {
        const searchType = type === 'Articles' ? 'article' : (type === 'Documents' ? 'pdf' : null);
        if (searchType) {
          items = items.filter(item => item.type === searchType);
        }
      }
      
      const mappedItems = items.map(item => ({
        id: item._id,
        title: item.title,
        type: item.type.toUpperCase(),
        timestamp: new Date(item.createdAt).toLocaleDateString(),
        thumbnail: item.metadata?.imageUrl || item.metadata?.thumbnailUrl || null,
        tags: item.tags || []
      }));
      setRecentItems(mappedItems);
    } catch (e) {
      console.error(e);
    }
  };

  const value = useMemo(() => ({
    collections,
    recentItems,
    loading,
    error,
    filterItems,
    isCreateCollectionModalOpen,
    setIsCreateCollectionModalOpen,
    addCollection,
    loadCollections
  }), [collections, recentItems, loading, error, isCreateCollectionModalOpen, loadCollections]);

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};
