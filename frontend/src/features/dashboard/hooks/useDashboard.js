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
    setFilter,
    setLayout,
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

  const createItem = useCallback(async (itemData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(itemData).forEach(key => {
        if (itemData[key] !== undefined && itemData[key] !== null) {
          formData.append(key, itemData[key]);
        }
      });
      await dashboardApi.saveItem(formData);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to create item:', err);
      setError('Could not save your capture.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, loadDashboardData]);

  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await dashboardApi.deleteItem(id);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('Could not delete the item.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, loadDashboardData]);

  return {
    ...state,
    loadDashboardData,
    createItem,
    deleteItem,
  };
};
