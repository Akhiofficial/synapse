import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from './app.routes';


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
