import React from 'react';

const CollectionCard = ({ collection }) => {
  const { title, description, itemCount, icon, color, iconColor, isPriority } = collection;

  return (
    <div className="glass-card border border-white/10 p-8 rounded-[32px] group hover:border-brand-orange/30 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -top-20 -left-20 w-40 h-40 ${color} rounded-full blur-[80px] group-hover:blur-[100px] transition-all`}></div>
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`w-16 h-16 ${color} rounded-[20px] flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor} text-3xl font-fill-1`}>{icon}</span>
        </div>
        
        {isPriority && (
          <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-bold tracking-[0.2em] px-3 py-1.5 rounded-full border border-brand-orange/20 uppercase">
            Priority
          </span>
        )}
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
