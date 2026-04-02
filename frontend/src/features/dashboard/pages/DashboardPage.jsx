import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ResurfacingSection from '../components/ResurfacingSection';
import CaptureCard from '../components/CaptureCard';
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
    loadDashboardData 
  } = useDashboard();

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black">
        <div className="text-primary animate-pulse text-xl font-display">Syncing with your mind...</div>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen">
      <Sidebar />
      <Topbar />
      <AddContentModal />
      <main className="ml-64 pt-24 px-8 pb-12">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
            {error}
          </div>
        )}

        <ResurfacingSection items={resurfaceItems} />

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
              Recent Captures
              <span className="text-xs font-label bg-surface-container-high px-2 py-1 rounded-full text-on-surface-variant">
                {recentItems.length} Items
              </span>
            </h2>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-xs font-label text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 text-xs font-label text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">grid_view</span>
                Layout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <CaptureCard key={item._id} item={item} />
            ))}
          </div>

          {recentItems.length === 0 && !loading && (
            <div className="text-center py-24 text-on-surface-variant opacity-40">
              <span className="material-symbols-outlined text-6xl block mb-4">inventory_2</span>
              <p>No captures found. Try adding a new memory!</p>
            </div>
          )}
        </section>
      </main>

      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-[-1]"></div>
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
