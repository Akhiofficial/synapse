import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useCollections } from '../../collections/store/CollectionsContext';
import { addItemToCollection, removeItemFromCollection } from '../../collections/services/collections.api';

const CaptureCard = ({ item }) => {
  const navigate = useNavigate();
  const { deleteItem } = useDashboard();
  const { collections, loadCollections } = useCollections() || { collections: [] };
  const [showCollections, setShowCollections] = useState(false);
  const menuRef = useRef(null);
  const { _id, title, type, content, tags, createdAt, metadata, collectionId } = item;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCollections(false);
      }
    };
    if (showCollections) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCollections]);

  const currentCollection = collections.find(c => c.id === collectionId);

  const getIcon = () => {
    switch (type) {
      case 'article': return 'article';
      case 'image': return 'image';
      case 'youtube': return 'play_circle';
      case 'tweet': return 'chat';
      case 'pdf': return 'description';
      case 'code': return 'terminal';
      case 'audio': return 'mic';
      default: return 'bookmark';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div 
      onClick={() => navigate(`/dashboard/item/${_id}`)}
      className="glass-card p-4 flex flex-col hover:bg-surface-container-high/60 transition-all duration-300 group cursor-pointer border border-transparent hover:border-brand-orange/20"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="material-symbols-outlined text-brand-orange font-fill-1">{getIcon()}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:text-white text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Forget this memory?')) deleteItem(_id);
            }}
            className="p-1 hover:text-red-500 text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>

      {type === 'image' && metadata?.imageUrl && (
        <div className="h-32 -mx-4 -mt-1 mb-3 overflow-hidden">
          <img src={metadata.imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      {type === 'code' && (
        <div className="bg-surface-container-lowest p-3 rounded-md mb-3 font-mono text-[10px] text-brand-orange/80 overflow-hidden border border-white/5">
          <pre className="whitespace-pre-wrap">{content?.slice(0, 100)}...</pre>
        </div>
      )}

      <h4 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
        {title}
      </h4>
      
      {currentCollection && (
        <div className="flex items-center gap-1.5 mb-2 scale-90 origin-left opacity-70">
            <span className={`material-symbols-outlined text-sm ${currentCollection.iconColor}`}>{currentCollection.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">{currentCollection.title}</span>
        </div>
      )}
      
      {(metadata?.summary || content) && type !== 'code' && (
        <p className="text-[13px] text-on-surface-variant line-clamp-2 mb-3 font-body leading-relaxed italic opacity-80">
          <span className="material-symbols-outlined text-[10px] mr-1 align-middle text-brand-orange">auto_awesome</span>
          {metadata?.summary || content}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-auto">
        {tags?.map((tag) => (
          <span key={tag} className="text-[9px] font-bold tracking-tighter bg-surface-variant px-2 py-0.5 rounded uppercase text-on-surface-variant">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-label text-on-surface-variant">
          Capture: {getTimeAgo(createdAt)}
        </span>
        <div className="relative">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowCollections(!showCollections);
                }}
                className={`material-symbols-outlined text-sm transition-colors ${showCollections ? 'text-brand-orange' : 'text-on-surface-variant hover:text-white'}`}
            >
                more_horiz
            </button>

            {showCollections && (
                <div 
                    ref={menuRef}
                    className="absolute bottom-full right-0 mb-2 w-48 glass-card border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5 mb-1">Actions</div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('Forget this memory?')) {
                                    await deleteItem(_id);
                                    setShowCollections(false);
                                }
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-red-500/10 text-red-500 transition-colors border-b border-white/5 mb-1"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            <span>Delete Memory</span>
                        </button>

                        <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">Move to Collection</div>
                        {collections.map(col => (
                            <button
                                key={col.id}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await addItemToCollection(col.id, _id);
                                    setShowCollections(false);
                                    if (loadCollections) loadCollections();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors ${collectionId === col.id ? 'text-brand-orange bg-brand-orange/5' : 'text-white/70'}`}
                            >
                                <span className={`material-symbols-outlined text-sm ${col.iconColor}`}>{col.icon}</span>
                                <span className="truncate">{col.title}</span>
                                {collectionId === col.id && <span className="material-symbols-outlined text-xs ml-auto">check</span>}
                            </button>
                        ))}
                        
                        {collectionId && (
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await removeItemFromCollection(collectionId, _id);
                                    setShowCollections(false);
                                    if (loadCollections) loadCollections();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 text-white/40 transition-colors border-t border-white/5 mt-1"
                            >
                                <span className="material-symbols-outlined text-sm">folder_off</span>
                                <span>Remove from collection</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CaptureCard;
