import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../../dashboard/hooks/useDashboard';
import { useCollections } from '../store/CollectionsContext';
import { addItemToCollection, removeItemFromCollection } from '../services/collections.api';

const CollectionListItem = ({ item }) => {
  const { id, title, type, timestamp, thumbnail, tags, collectionId } = item;
  const { deleteItem } = useDashboard();
  const { collections, loadCollections } = useCollections();
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActions]);

  const getTypeColor = (type) => {
    switch (type.toUpperCase()) {
      case 'ARTICLE': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PDF': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'VIDEO': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'YOUTUBE': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'IMAGE': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="flex items-center gap-6 p-5 rounded-3xl hover:bg-white/3 border border-transparent hover:border-white/5 transition-all group cursor-pointer font-body relative">
      {/* Thumbnail / Icon */}
      <div className="w-16 h-12 rounded-xl overflow-hidden bg-brand-black/50 border border-white/5 flex items-center justify-center shrink-0">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        ) : (
          <span className="material-symbols-outlined text-on-surface-variant/40 text-xl">
            {type === 'PDF' ? 'picture_as_pdf' : 'article'}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-[8px] font-bold tracking-widest px-2 py-0.5 rounded border uppercase transition-colors ${getTypeColor(type)}`}>
            {type}
          </span>
          <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">{timestamp}</span>
        </div>
        <h4 className="text-white font-bold text-base truncate group-hover:text-brand-orange transition-colors">{title}</h4>
      </div>

      <div className="hidden md:flex items-center gap-2 px-4 shrink-0">
        {tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] text-on-surface-variant/40 font-medium px-3 py-1 bg-white/2 rounded-full border border-white/5 hover:border-brand-orange/30 hover:text-brand-orange transition-all tracking-tight capitalize">
            #{tag}
          </span>
        ))}
      </div>

      <div className="relative group/actions shrink-0">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${showActions ? 'bg-brand-orange/20 text-brand-orange' : 'hover:bg-white/5 text-on-surface-variant hover:text-white'}`}
        >
          <span className="material-symbols-outlined">more_vert</span>
        </button>

        {showActions && (
          <div 
            ref={menuRef}
            className="absolute top-12 right-0 w-52 glass-card border-white/10 shadow-2xl py-2 z-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5 mb-1">Actions</div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm('Forget this memory?')) {
                            await deleteItem(id);
                            setShowActions(false);
                            if (loadCollections) loadCollections();
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
                            await addItemToCollection(col.id, id);
                            setShowActions(false);
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
                            await removeItemFromCollection(collectionId, id);
                            setShowActions(false);
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
  );
};

export default CollectionListItem;
