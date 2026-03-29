import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useItemDetail } from '../hooks/useItemDetail';
import ItemContent from '../components/ItemDetail/ItemContent';
import AISummary from '../components/ItemDetail/AISummary';
import RelatedInsights from '../components/ItemDetail/RelatedInsights';
import PersonalSynthesis from '../components/ItemDetail/PersonalSynthesis';
import { DashboardProvider } from '../store/DashboardContext';

const ItemDetailContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, relatedItems, loading, error, loadItemDetail } = useItemDetail();

  useEffect(() => {
    if (id) {
      loadItemDetail(id);
      window.scrollTo(0, 0);
    }
  }, [id, loadItemDetail]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black">
        <div className="text-brand-orange animate-pulse text-xl font-display">Syncing with your memory...</div>
      </div>
    );
  }

  if (error || (!item && !loading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black flex-col gap-4">
        <div className="text-red-500 font-display text-xl">{error || "Neural link severed. Insight not found."}</div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-white bg-white/10 px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen">
      <Sidebar />
      <Topbar />
      
      <main className="ml-64 pt-24 px-8 pb-32">
        {/* Breadcrumbs / Back Navigation */}
        <div className="mb-12 flex items-center gap-4 text-on-surface-variant/40 text-[11px] font-label uppercase tracking-widest">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-brand-orange transition-colors"
          >
            Dashboard
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface-variant font-bold">
            {item.type}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="xl:col-span-8">
            <ItemContent item={item} />
            <PersonalSynthesis />
          </div>

          {/* Sidebar Column */}
          <div className="xl:col-span-4 flex flex-col gap-12">
            <AISummary summary={item.metadata?.summary} />
            <RelatedInsights items={relatedItems} />
          </div>
        </div>
      </main>

      {/* Decorative Backgrounds */}
      <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] bg-brand-orange/10 blur-[150px] rounded-full pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
    </div>
  );
};

const ItemDetailPage = () => (
  <DashboardProvider>
    <ItemDetailContent />
  </DashboardProvider>
);

export default ItemDetailPage;
