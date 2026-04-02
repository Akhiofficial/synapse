import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useCollections } from '../../collections/store/CollectionsContext';
import { addItemToCollection, removeItemFromCollection } from '../../collections/services/collections.api';

const CaptureListItem = ({ item }) => {
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
      className="glass-card hover:bg-surface-container-high/60 transition-all duration-300 group cursor-pointer border border-transparent hover:border-brand-orange/20 overflow-hidden"
    >
      <div className="flex items-center gap-4 p-3 sm:p-4">
        {/* Icon/Image Section */}
        <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-surface-container-low flex items-center justify-center border border-white/5 overflow-hidden">
          {type === 'image' && metadata?.imageUrl ? (
            <img src={metadata.imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <span className="material-symbols-outlined text-brand-orange font-fill-1 text-2xl sm:text-3xl">{getIcon()}</span>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-display font-bold text-base sm:text-lg leading-tight truncate group-hover:text-brand-orange transition-colors">
              {title}
            </h4>
            {currentCollection && (
              <span className={`material-symbols-outlined text-xs sm:text-sm ${currentCollection.iconColor} opacity-70`}>
                {currentCollection.icon}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[10px] sm:text-xs font-label text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px] sm:text-xs">schedule</span>
              {getTimeAgo(createdAt)}
            </span>
            <span className="text-[10px] sm:text-xs font-label text-on-surface-variant/60 uppercase tracking-widest">
              {type}
            </span>
            {tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[8px] sm:text-[10px] font-bold tracking-tighter bg-surface-variant px-1.5 py-0.5 rounded uppercase text-on-surface-variant">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Summary (Hidden on small screens) */}
        {(metadata?.summary || content) && (
          <p className="hidden lg:block flex-1 max-w-sm text-xs text-on-surface-variant line-clamp-1 italic opacity-60 ml-4">
            {metadata?.summary || content}
          </p>
        )}

        {/* Actions Button */}
        <div className="relative ml-2 flex items-center gap-2">
          <button 
              onClick={(e) => {
                  e.stopPropagation();
                  setShowCollections(!showCollections);
              }}
              className={`p-2 rounded-full hover:bg-white/5 material-symbols-outlined text-xl transition-colors ${showCollections ? 'text-brand-orange' : 'text-on-surface-variant hover:text-white'}`}
          >
              more_horiz
          </button>

          {showCollections && (
              <div 
                  ref={menuRef}
                  className="absolute top-12 right-0 w-48 glass-card border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200"
                  onClick={(e) => e.stopPropagation()}
              >
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

                      <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mb-1">Collections</div>
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
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureListItem;
