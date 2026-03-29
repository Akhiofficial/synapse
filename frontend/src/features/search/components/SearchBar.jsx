import React from 'react';

const SearchBar = ({ query, setQuery, onSearch }) => {
  const suggestions = [
    "AI tools for startups",
    "Design inspiration",
    "2025 revenue projections",
    "Neural network architectures"
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6">
      <div className="w-full relative group">
        <div className="absolute inset-0 bg-brand-orange/10 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000 -z-10"></div>
        <div className="relative">
          <input
            type="text"
            className="w-full h-16 px-8 rounded-full bg-surface-container-high/40 border border-white/5 hover:border-brand-orange/30 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all font-display text-xl outline-none pr-16 text-white placeholder-gray-500"
            placeholder="Search your knowledge..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <span className="material-symbols-outlined text-gray-500">search</span>
            <div className="hidden md:flex items-center gap-1 font-mono text-[9px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              <span className="material-symbols-outlined text-[10px]">keyboard_command_key</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center flex-wrap justify-center gap-4 text-xs">
        <span className="text-gray-500 opacity-60">Try:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:border-brand-orange/20 hover:bg-brand-orange/5 text-gray-400 hover:text-white transition-all duration-300"
          >
            "{suggestion}"
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
