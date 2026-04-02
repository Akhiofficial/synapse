import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '../store/CollectionsContext';

const CollectionCard = ({ collection }) => {
  const navigate = useNavigate();
  const { deleteCollection, updateCollection } = useCollections();
  const { id, title, description, itemCount, icon, color, iconColor, isPriority } = collection;
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

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"? Memories inside will be unlinked but not deleted.`)) {
      await deleteCollection(id);
    }
  };

  const handleRename = async (e) => {
    e.stopPropagation();
    const newName = window.prompt('Enter new collection name:', title);
    if (newName && newName !== title) {
      await updateCollection(id, newName);
    }
    setShowActions(false);
  };

  return (
    <div 
      onClick={() => navigate(`/collections/${id}`)}
      className="glass-card border border-white/10 p-8 rounded-[32px] group hover:border-brand-orange/30 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={`absolute -top-20 -left-20 w-40 h-40 ${color} rounded-full blur-[80px] group-hover:blur-[100px] transition-all`}></div>
      
      <div className={`flex justify-between items-start mb-10 relative ${showActions ? 'z-50' : 'z-10'}`}>
        <div className={`w-16 h-16 ${color} rounded-[20px] flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor} text-3xl font-fill-1`}>{icon}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {isPriority && (
            <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-bold tracking-[0.2em] px-3 py-1.5 rounded-full border border-brand-orange/20 uppercase">
              Priority
            </span>
          )}
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${showActions ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-on-surface-variant hover:text-white'}`}
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>

            {showActions && (
              <div 
                className="absolute top-12 right-0 w-48 bg-[#121212] glass-card border border-white/10 shadow-2xl py-2 z-100 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5 mb-1">Cluster Actions</div>
                <button
                  onClick={handleRename}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 text-white/70 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Rename Cluster</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-red-500/10 text-red-500 transition-colors border-t border-white/5 mt-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Delete Cluster</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1">
        <h3 className="text-white font-display text-2xl font-bold mb-3 group-hover:text-brand-orange transition-colors">{title}</h3>
        <p className="text-on-surface-variant text-sm font-body leading-relaxed line-clamp-2">{description}</p>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
        <span className="text-on-surface-variant text-xs font-bold tracking-wider">{itemCount} items</span>
        <button className="flex items-center gap-2 text-brand-orange text-xs font-bold hover:gap-3 transition-all uppercase tracking-widest">
          Open
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default CollectionCard;
