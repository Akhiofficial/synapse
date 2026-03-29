import React from 'react';

const CollectionListItem = ({ item }) => {
  const { title, type, timestamp, thumbnail, tags } = item;

  const getTypeColor = (type) => {
    switch (type) {
      case 'ARTICLE': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PDF': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'VIDEO': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="flex items-center gap-6 p-5 rounded-3xl hover:bg-white/3 border border-transparent hover:border-white/5 transition-all group cursor-pointer font-body">
      {/* Thumbnail / Icon */}
      <div className="w-20 h-14 rounded-xl overflow-hidden bg-brand-black/50 border border-white/5 flex items-center justify-center shrink-0">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        ) : (
          <span className="material-symbols-outlined text-on-surface-variant/40 text-2xl">
            {type === 'PDF' ? 'picture_as_pdf' : 'article'}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border uppercase ${getTypeColor(type)}`}>
            {type}
          </span>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{timestamp}</span>
        </div>
        <h4 className="text-white font-bold text-lg truncate group-hover:text-brand-orange transition-colors">{title}</h4>
      </div>

      <div className="flex items-center gap-2 px-4 shrink-0">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] text-on-surface-variant/60 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:border-brand-orange/30 hover:text-brand-orange transition-all tracking-tight">
            #{tag}
          </span>
        ))}
      </div>

      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-on-surface-variant transition-all shrink-0">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
    </div>
  );
};

export default CollectionListItem;
