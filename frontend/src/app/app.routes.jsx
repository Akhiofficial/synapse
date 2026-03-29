import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import GraphPage from '../features/graph/pages/GraphPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import CollectionsPage from '../features/collections/pages/CollectionsPage';
import SearchPage from '../features/search/pages/SearchPage';
import ItemDetailPage from '../features/dashboard/pages/ItemDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/item/:id" element={<ItemDetailPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/graph" element={<GraphPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default AppRoutes;

