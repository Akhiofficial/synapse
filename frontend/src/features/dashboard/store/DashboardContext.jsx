import React, { createContext, useState, useMemo } from 'react';
import { dummyResurfaceItems, dummyRecentItems } from '../services/dummyData';

export const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [resurfaceItems, setResurfaceItems] = useState(dummyResurfaceItems);
  const [recentItems, setRecentItems] = useState(dummyRecentItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    }),
    [resurfaceItems, recentItems, loading, error]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
