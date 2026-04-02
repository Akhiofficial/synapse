import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MobileHeader from '../components/MobileHeader';
import ResurfacingSection from '../components/ResurfacingSection';
import CaptureCard from '../components/CaptureCard';
import CaptureListItem from '../components/CaptureListItem';
import AddContentModal from '../components/AddContentModal';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardProvider } from '../store/DashboardContext';
import { CollectionsProvider } from '../../collections/store/CollectionsContext';

const DashboardContent = () => {
  const { 
    resurfaceItems, 
    recentItems, 
    loading, 
    error, 
    loadDashboardData,
    filter,
    setFilter,
    layout,
    setLayout
  } = useDashboard();

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };
    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterMenu]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black">
        <div className="text-primary animate-pulse text-xl font-display">Syncing with your mind...</div>
      </div>
    );
  }

  const filterOptions = [
    { id: 'all', label: 'All Types', icon: 'border_all' },
    { id: 'article', label: 'Articles', icon: 'article' },
    { id: 'image', label: 'Images', icon: 'image' },
    { id: 'youtube', label: 'Videos', icon: 'play_circle' },
    { id: 'tweet', label: 'Tweets', icon: 'chat' },
    { id: 'pdf', label: 'Documents', icon: 'description' },
    { id: 'code', label: 'Code Snippets', icon: 'terminal' },
  ];

  const filteredItems = filter === 'all' 
    ? recentItems 
    : recentItems.filter(item => item.type === filter);

  return (
    <div className="bg-brand-black min-h-screen">
      <Sidebar />
      <MobileHeader />
      <Topbar />
      <AddContentModal />
      <main className="ml-0 md:ml-64 pt-24 px-4 md:px-8 pb-12 transition-all duration-300">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
            {error}
          </div>
        )}

        <ResurfacingSection items={resurfaceItems} />

        <section className="mt-12 md:mt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
              Recent Captures
              <span className="text-xs font-label bg-surface-container-high px-2 py-1 rounded-full text-on-surface-variant">
                {filteredItems.length} Items
              </span>
            </h2>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none" ref={filterMenuRef}>
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 text-xs font-label px-4 py-2 rounded-lg transition-all duration-300 ${
                    filter !== 'all' 
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                      : 'text-on-surface-variant hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {filterOptions.find(opt => opt.id === filter)?.icon || 'filter_list'}
                  </span>
                  {filterOptions.find(opt => opt.id === filter)?.label || 'Filter'}
                </button>

                {showFilterMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 glass-card border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5 mb-1">Filter by Type</div>
                    {filterOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setFilter(option.id);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${
                          filter === option.id 
                            ? 'text-brand-orange bg-brand-orange/5 font-bold' 
                            : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{option.icon}</span>
                        <span>{option.label}</span>
                        {filter === option.id && <span className="material-symbols-outlined text-xs ml-auto">check</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-label px-4 py-2 rounded-lg transition-all duration-300 ${
                  layout === 'list'
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'text-on-surface-variant hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {layout === 'grid' ? 'grid_view' : 'view_list'}
                </span>
                {layout === 'grid' ? 'Grid' : 'List'}
              </button>
            </div>
          </div>

          <div className={
            layout === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }>
            {filteredItems.map((item) => (
              layout === 'grid' 
                ? <CaptureCard key={item._id} item={item} />
                : <CaptureListItem key={item._id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-24 text-on-surface-variant opacity-40">
              <span className="material-symbols-outlined text-6xl block mb-4">
                {filter === 'all' ? 'inventory_2' : 'filter_alt_off'}
              </span>
              <p>
                {filter === 'all' 
                  ? 'No captures found. Try adding a new memory!' 
                  : `No ${filterOptions.find(opt => opt.id === filter)?.label.toLowerCase()} found.`
                }
              </p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="mt-4 text-brand-orange text-sm font-bold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/5 blur-[70px] md:blur-[100px] rounded-full pointer-events-none z-[-1]"></div>
    </div>
  );
};

const DashboardPage = () => (
  <DashboardProvider>
    <CollectionsProvider>
      <DashboardContent />
    </CollectionsProvider>
  </DashboardProvider>
);

export default DashboardPage;
