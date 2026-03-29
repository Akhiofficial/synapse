import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;
