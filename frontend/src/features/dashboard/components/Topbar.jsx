import React from 'react';

const Topbar = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-40 bg-brand-black/80 backdrop-blur-xl border-b border-white/5 font-display">
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
        <nav className="hidden md:flex items-center gap-6">
          <button className="text-brand-orange font-semibold border-b-2 border-brand-orange pb-1 text-sm">
            Recent
          </button>
          <button className="text-gray-400 hover:text-white transition-opacity text-sm">
            Pinned
          </button>
          <button className="text-gray-400 hover:text-white transition-opacity text-sm">
            Shared
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined">bolt</span>
        </button>
        <div className="h-8 w-px bg-white/10 mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
          <img
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-primary/20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0UC02q2VrLSvU5wk2D2wN5IM4YBlkVvoBNfYaDeMQECP0941o54tDtaIkLdxw_a9B64PWqI7A9gEVICDVzHPT5hY3RwwrXSVziJsBvddqr3f4M2pD3x9xvI3GFMP3IhsB-CHfS4POnJnbWCgrvjnDbJl_OBB1cNa0K745ceIU5wxfvCHUvMoo7HrQ62XOFvQTHbwCeX9d8RjFv0IzWf0O7XTAmMJYceypXRf2pZWPI0Ebu42hbxPA7yUBGA-2DRCvKLyHZ9puW8RY"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
