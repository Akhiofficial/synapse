import { useContext, useCallback } from 'react';
import { DashboardContext } from '../store/DashboardContext';
import * as dashboardApi from '../services/dashboard.api';

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  const {
    setResurfaceItems,
    setRecentItems,
    setLoading,
    setError,
    ...state
  } = context;

  const loadDashboardData = useCallback(async () => {
    // Enabled to use real backend data
    setLoading(true);
    setError(null);
    try {
      const [resurface, recent] = await Promise.all([
        dashboardApi.fetchResurfaceItems(),
        dashboardApi.fetchRecentItems(),
      ]);
      setResurfaceItems(resurface);
      setRecentItems(recent.items || recent); 
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not fetch dashboard contents.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setResurfaceItems, setRecentItems]);

  return {
    ...state,
    loadDashboardData,
  };
};
