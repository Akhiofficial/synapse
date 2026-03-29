import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../features/landing/pages/LandingPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import CollectionsPage from '../features/collections/pages/CollectionsPage';
import GraphPage from '../features/graph/pages/GraphPage';
import SearchPage from '../features/search/pages/SearchPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
