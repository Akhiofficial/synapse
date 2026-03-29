import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import GraphPage from '../features/graph/pages/GraphPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/graph" element={<GraphPage />} />
    </Routes>
  );
};

export default AppRoutes;

