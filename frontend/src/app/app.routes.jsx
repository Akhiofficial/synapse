import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import GraphPage from '../features/graph/pages/GraphPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import CollectionsPage from '../features/collections/pages/CollectionsPage';
import CollectionDetailPage from '../features/collections/pages/CollectionDetailPage';
import SearchPage from '../features/search/pages/SearchPage';
import ItemDetailPage from '../features/dashboard/pages/ItemDetailPage';
import LoginPage from '../features/auth/pages/login';
import SignupPage from '../features/auth/pages/signup';
import HelpPage from '../features/help/pages/HelpPage';
import { AuthProvider } from '../features/auth/store/auth.context';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/item/:id" element={<ProtectedRoute><ItemDetailPage /></ProtectedRoute>} />
        <Route path="/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
        <Route path="/collections/:id" element={<ProtectedRoute><CollectionDetailPage /></ProtectedRoute>} />
        <Route path="/graph" element={<ProtectedRoute><GraphPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
