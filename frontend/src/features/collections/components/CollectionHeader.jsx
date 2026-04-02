import React from 'react';

const CollectionHeader = ({ title, itemCount, lastUpdated }) => {
  return (
    <div className="flex justify-between items-start mb-12">
      <div className="max-w-2xl">
        <h1 className="text-white font-display text-7xl font-bold mb-6 tracking-tighter leading-tight">
          {title || "Untitled Collection"}
        </h1>
        <div className="flex items-center gap-4 text-on-surface-variant font-medium text-lg">
          <span className="material-symbols-outlined text-brand-orange/80 text-xl font-fill-1">temp_preferences_custom</span>
          <span className="tracking-tight text-white/90">{itemCount || 0} Neural Links</span>
          <span className="text-white/20 text-2xl mx-1">·</span>
          <span className="text-on-surface-variant/60">Updated {lastUpdated || "recently"}</span>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;
