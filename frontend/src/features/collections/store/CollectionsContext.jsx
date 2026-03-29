import React, { createContext, useContext, useState, useMemo } from 'react';
import { dummyCollections, dummyRecentCollectionItems } from '../services/collections.dummy';

export const CollectionsContext = createContext();

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState(dummyCollections);
  const [recentItems, setRecentItems] = useState(dummyRecentCollectionItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] = useState(false);

  const filterItems = (type) => {
    if (type === 'All Types') {
      setRecentItems(dummyRecentCollectionItems);
    } else {
      setRecentItems(dummyRecentCollectionItems.filter(item => item.type === type.toUpperCase()));
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
  }), [collections, recentItems, loading, error, isCreateCollectionModalOpen]);

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
