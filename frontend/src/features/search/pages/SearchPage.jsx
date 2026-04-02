import React, { useState } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../dashboard/components/Topbar';
import MobileHeader from '../../dashboard/components/MobileHeader';
import { useSearch } from '../hooks/useSearch';
import SearchBar from '../components/SearchBar';
import SearchResultCard from '../components/SearchResultCard';
import { DashboardProvider } from '../../dashboard/store/DashboardContext';
import AddContentModal from '../../dashboard/components/AddContentModal';

const SearchContent = () => {

  const { query, setQuery, results, loading, error, refreshSearch } = useSearch();
  const [activeTab, setActiveTab] = useState('Deep Search');

  const tabs = ['Knowledge Weaver', 'Deep Search', 'Connections', 'Visualize'];

  return (
    <div className="bg-brand-black min-h-screen text-white font-display overflow-x-hidden">
      <Sidebar />
      <MobileHeader />
      <Topbar />
      <AddContentModal />


      <main className="ml-0 md:ml-64 pt-20 md:pt-24 px-4 md:px-8 pb-12 relative transition-all duration-300">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-8 md:gap-12 border-b border-white/5 mb-12 md:mb-16 px-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium tracking-wide transition-all relative whitespace-nowrap ${activeTab === tab
                  ? 'text-brand-orange'
                  : 'text-gray-500 hover:text-white'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-orange shadow-[0_0_10px_rgba(255,107,53,0.5)]"></div>
              )}
            </button>
          ))}

          <div className="hidden md:flex ml-auto items-center gap-4 pb-4">
            <span className="material-symbols-outlined text-gray-500 text-lg hover:text-white transition-colors cursor-pointer">notifications</span>
            <span className="material-symbols-outlined text-gray-500 text-lg hover:text-white transition-colors cursor-pointer">auto_awesome</span>
            <button className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-colors">Sync Data</button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-gray-500">person</span>
            </div>
          </div>
        </nav>

        {/* Search Header Section */}
        <section className="flex flex-col items-center justify-center py-6 md:py-12 mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-8 md:mb-12 text-center max-w-lg md:max-w-none">
            What's on your <span className="italic font-light">mind</span>?
          </h1>

          <SearchBar query={query} setQuery={setQuery} onSearch={refreshSearch} />
        </section>

        {/* Results Section */}
        <section className="max-w-7xl mx-auto px-2 md:px-0">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-2 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin"></div>
              <p className="text-sm font-mono text-brand-orange animate-pulse uppercase tracking-widest">Traversing Neurons...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center mb-8">
              {error}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {results.map((item, index) => (
                <div key={item._id || index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <SearchResultCard item={item} />
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="text-center py-24 text-gray-500/40">
              <span className="material-symbols-outlined text-6xl block mb-4">search_off</span>
              <p className="text-lg md:text-xl font-body">No semantic matches found for "{query}"</p>
            </div>
          )}

          {!loading && !query && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 opacity-20 text-center">
              <span className="text-6xl sm:text-8xl md:text-[120px] font-bold tracking-tighter select-none font-display">SYNAPSE</span>
              <p className="text-[10px] md:text-sm uppercase tracking-[0.5em] md:tracking-[1em] -mt-4 md:-mt-8 select-none">Begin Discovery</p>
            </div>
          )}
        </section>

        {/* AI Suggestion Banner */}
        {!loading && results.length > 2 && (
          <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40 animate-slide-up">
            <div className="glass-card p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between border-brand-orange/30 shadow-2xl shadow-brand-orange/10 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-brand-orange text-sm animate-pulse">auto_awesome</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-300">
                  <span className="text-white font-bold">AI suggests:</span> Connect to similar neural nodes?
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-brand-orange text-white text-[10px] font-bold hover:scale-105 transition-transform">Relate</button>
                <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[10px]">close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="hidden sm:flex fixed bottom-8 right-8 items-center gap-4 text-[10px] font-mono tracking-widest uppercase text-gray-500 select-none">
          <div className="h-px w-12 bg-white/5"></div> PROCESSING DEEPER LAYERS...
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>
        </div>
      </main>

      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none z-[-1]"></div>
    </div>
  );
};

const SearchPage = () => (
  <DashboardProvider>
    <SearchContent />
  </DashboardProvider>
);

export default SearchPage;

