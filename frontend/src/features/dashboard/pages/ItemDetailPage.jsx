import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MobileHeader from '../components/MobileHeader';
import { useItemDetail } from '../hooks/useItemDetail';
import ItemContent from '../components/ItemDetail/ItemContent';
import AISummary from '../components/ItemDetail/AISummary';
import RelatedInsights from '../components/ItemDetail/RelatedInsights';
import PersonalNotesSidebar from '../components/ItemDetail/PersonalNotesSidebar';
import PersonalSynthesis from '../components/ItemDetail/PersonalSynthesis';
import { DashboardProvider } from '../store/DashboardContext';

const ItemDetailContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    item, 
    highlights, 
    relatedItems, 
    loading, 
    error, 
    loadItemDetail,
    addHighlight,
    removeHighlight,
    editHighlight,
    updateItemData
  } = useItemDetail();

  useEffect(() => {
    if (id) {
      loadItemDetail(id);
      window.scrollTo(0, 0);
    }
  }, [id, loadItemDetail]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black px-4">
        <div className="text-brand-orange animate-pulse text-lg md:text-xl font-display text-center">Syncing with your memory...</div>
      </div>
    );
  }

  if (error || (!item && !loading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black flex-col gap-6 px-4 text-center">
        <div className="text-red-500 font-display text-xl">{error || "Neural link severed. Insight not found."}</div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-white bg-white/10 px-8 py-3 rounded-full hover:bg-white/20 transition-all active:scale-95 text-sm font-bold uppercase tracking-widest"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen">
      <Sidebar />
      <MobileHeader />
      <Topbar />
      
      <main className="ml-0 md:ml-64 pt-20 md:pt-24 px-4 md:px-8 pb-32 transition-all duration-300">
        {/* Breadcrumbs / Back Navigation */}
        <div className="mb-8 md:mb-12 flex items-center gap-3 md:gap-4 text-on-surface-variant/40 text-[10px] md:text-[11px] font-label uppercase tracking-widest overflow-x-auto scrollbar-hide whitespace-nowrap">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-brand-orange transition-colors"
          >
            Dashboard
          </button>
          <span className="material-symbols-outlined text-[12px] md:text-sm shrink-0">chevron_right</span>
          <span className="text-on-surface-variant font-bold shrink-0">
            {item.type}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-8 md:gap-12 order-2 lg:order-1">
            <ItemContent 
              item={item} 
              highlights={highlights}
              onAddHighlight={addHighlight}
            />
            <PersonalSynthesis 
              item={item} 
              onUpdate={updateItemData} 
            />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-8 md:gap-12 order-1 lg:order-2">
            <PersonalNotesSidebar 
              highlights={highlights}
              onDelete={removeHighlight}
              onEdit={editHighlight}
            />
            <AISummary summary={item.metadata?.summary} />
            <RelatedInsights items={relatedItems} />
          </div>
        </div>
      </main>

      {/* Decorative Backgrounds */}
      <div className="fixed top-[-15%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-orange/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-brand-orange/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
    </div>
  );
};

const ItemDetailPage = () => (
  <DashboardProvider>
    <ItemDetailContent />
  </DashboardProvider>
);

export default ItemDetailPage;
