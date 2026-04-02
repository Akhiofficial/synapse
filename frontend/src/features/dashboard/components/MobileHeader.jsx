import React from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../../../app/UIContext';

const MobileHeader = () => {
  const { toggleSidebar } = useUI();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-brand-black/80 backdrop-blur-lg border-b border-white/5 z-40 flex items-center px-6 md:hidden">
      <button 
        onClick={toggleSidebar}
        className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Toggle Menu"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
      <div className="flex-1 ml-4">
        <h1 className="text-xl font-bold tracking-tighter text-brand-orange uppercase">Synapse</h1>
      </div>
      <Link 
        to="/search"
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-2xl">search</span>
      </Link>
    </header>
  );
};

export default MobileHeader;
