import React, { useState } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../dashboard/components/Topbar';
import AddContentModal from '../../dashboard/components/AddContentModal';
import CreateCollectionModal from '../components/CreateCollectionModal';
import CollectionCard from '../components/CollectionCard';
import CollectionListItem from '../components/CollectionListItem';
import { useCollections, CollectionsProvider } from '../store/CollectionsContext';
import { DashboardProvider } from '../../dashboard/store/DashboardContext';

const CollectionsContent = () => {
  const { collections, recentItems, filterItems, setIsCreateCollectionModalOpen } = useCollections();
  const [activeFilter, setActiveFilter] = useState('All Types');

  const filters = ['All Types', 'Articles', 'Documents'];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    filterItems(filter);
  };

  return (
    <div className="bg-brand-black min-h-screen font-body selection:bg-brand-orange/30">
      <Sidebar />
      <Topbar />
      <AddContentModal />
      <CreateCollectionModal />

      <main className="ml-64 pt-24 px-12 pb-24">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h1 className="text-white font-display text-5xl font-bold mb-4 tracking-tight">Collections</h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Synthesize your cross-platform knowledge into structured intelligence clusters.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateCollectionModalOpen(true)}
            className="bg-linear-to-br from-brand-orange to-orange-400 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-brand-orange/20 flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined font-fill-1">add</span>
            Create Collection
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>

        {/* Recent Section */}
        <section>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-white font-display text-3xl font-bold tracking-tight">Recent from Collections</h2>
            
            <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-brand-black/80 text-white shadow-lg border border-white/5'
                      : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {recentItems.length > 0 ? (
              recentItems.map(item => (
                <CollectionListItem key={item.id} item={item} />
              ))
            ) : (
              <div className="p-20 flex flex-col items-center justify-center text-on-surface-variant opacity-40">
                <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                <p className="text-lg font-bold">No results found for this filter</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// Wrap with necessary providers
const CollectionsPage = () => {
  return (
    <DashboardProvider>
      <CollectionsProvider>
        <CollectionsContent />
      </CollectionsProvider>
    </DashboardProvider>
  );
};

export default CollectionsPage;
