import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../dashboard/components/Topbar';
import { useCollections, CollectionsProvider } from '../store/CollectionsContext';
import { DashboardProvider } from '../../dashboard/store/DashboardContext';
import CollectionHeader from '../components/CollectionHeader';
import AIContextSummary from '../components/AIContextSummary';
import NeuralProximitySidebar from '../components/NeuralProximitySidebar';
import CaptureCard from '../../dashboard/components/CaptureCard';

const CollectionDetailContent = () => {
  const { id } = useParams();
  const { loadCollectionItems, loading } = useCollections();
  const [collectionData, setCollectionData] = useState({ name: '', items: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadCollectionItems(id);
      if (data) {
        setCollectionData({ name: data.collection, items: data.items });
      }
    };
    fetchData();
  }, [id, loadCollectionItems]);

  const filteredItems = collectionData.items.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-brand-black min-h-screen font-body selection:bg-brand-orange/30">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-28 px-14 pb-24 flex flex-col lg:flex-row gap-20">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <CollectionHeader 
            title={collectionData.name} 
            itemCount={collectionData.items.length} 
            lastUpdated={collectionData.items.length > 0 ? new Date(collectionData.items[0].createdAt).toLocaleDateString() : 'recently'}
            onSearch={setSearchQuery}
          />

          {/* AI Summary */}
          <AIContextSummary summary={collectionData.items[0]?.metadata?.summary} />

          {/* Nodes Section */}
          <section className="mt-20">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-white/40 uppercase font-label tracking-widest text-xs font-bold">Linked Content Nodes</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-orange/20 text-brand-orange' : 'text-on-surface-variant hover:text-white'}`}
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-orange/20 text-brand-orange' : 'text-on-surface-variant hover:text-white'}`}
                >
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-4xl"></div>)}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredItems.map(item => (
                  <CaptureCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-32 border-2 border-dashed border-white/5 rounded-[3rem] text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-6xl mb-4">dataset</span>
                  <p className="text-xl font-display italic">No neural links found matching your query.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <NeuralProximitySidebar />
      </main>
    </div>
  );
};

const CollectionDetailPage = () => {
  return (
    <DashboardProvider>
      <CollectionsProvider>
        <CollectionDetailContent />
      </CollectionsProvider>
    </DashboardProvider>
  );
};

export default CollectionDetailPage;
