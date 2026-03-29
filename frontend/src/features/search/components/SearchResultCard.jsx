import React from 'react';

const SearchResultCard = ({ item }) => {
  const { title, type, content, tags, createdAt, score } = item;

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'article': return 'article';
      case 'image': return 'image';
      case 'youtube': return 'play_circle';
      case 'tweet': return 'chat';
      case 'pdf': return 'description';
      case 'whitepaper': return 'menu_book';
      case 'analysis': return 'analytics';
      case 'archive': return 'inventory_2';
      default: return 'bookmark';
    }
  };

  const getTagColor = (type) => {
    switch (type.toLowerCase()) {
      case 'article': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'analysis': return 'bg-brand-orange/20 text-brand-orange border-brand-orange/30';
      case 'archive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'whitepaper': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-surface-variant text-on-surface-variant border-white/10';
    }
  };

  return (
    <div className="glass-card group relative p-6 flex flex-col h-full hover:bg-white/3 transition-all duration-500 border border-white/5 hover:border-brand-orange/30 overflow-hidden">
      {/* Type Badge - Top Right */}
      <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${getTagColor(type)}`}>
        {type}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface-container-high/50 flex items-center justify-center border border-white/5 group-hover:bg-brand-orange/10 transition-colors">
          <span className="material-symbols-outlined text-brand-orange/80 group-hover:text-brand-orange transition-colors">
            {getIcon()}
          </span>
        </div>
        {score && (
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
            Relevance: {(score * 100).toFixed(0)}%
          </div>
        )}
      </div>

      <h3 className="font-display font-bold text-xl leading-tight mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
        {title}
      </h3>

      <p className="text-sm text-gray-400/80 mb-6 font-body leading-relaxed line-clamp-3">
        {content}
      </p>

      <div className="mt-auto flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <span key={tag} className="text-[10px] font-medium text-gray-500 hover:text-white transition-colors cursor-pointer">
            #{tag}
          </span>
        ))}
      </div>

      {/* Decorative Glow on Hover */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-brand-orange/5 blur-3xl rounded-full group-hover:bg-brand-orange/10 transition-all duration-700"></div>
    </div>
  );
};

export default SearchResultCard;
