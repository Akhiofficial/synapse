import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app.routes';
import { UIProvider } from './UIContext';

function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AppRoutes />
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
