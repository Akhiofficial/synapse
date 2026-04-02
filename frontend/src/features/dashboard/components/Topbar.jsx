import React from 'react';

const Topbar = () => {
  return (
    <header className="hidden md:flex fixed top-0 right-0 left-64 h-16 justify-between items-center px-8 z-40 bg-brand-black/80 backdrop-blur-xl border-b border-white/5 font-display">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-brand-orange/50 text-white placeholder-on-surface-variant/50 transition-all outline-hidden"
            placeholder="Search your mind..."
            type="text"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
