import React, { createContext, useState, useMemo } from 'react';
import { dummyResurfaceItems, dummyRecentItems } from '../services/dummyData';

export const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [resurfaceItems, setResurfaceItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const value = useMemo(
    () => ({
      resurfaceItems,
      setResurfaceItems,
      recentItems,
      setRecentItems,
      loading,
      setLoading,
      error,
      setError,
      isAddModalOpen,
      setIsAddModalOpen,
    }),
    [resurfaceItems, recentItems, loading, error, isAddModalOpen]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
