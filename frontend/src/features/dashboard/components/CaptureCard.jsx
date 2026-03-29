import React from 'react';

const CaptureCard = ({ item }) => {
  const { title, type, content, tags, createdAt, metadata } = item;

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
    <div className="glass-card p-5 mt-5 flex flex-col hover:bg-surface-container-high/60 transition-all duration-300 group cursor-pointer border border-transparent hover:border-brand-orange/20">
      <div className="flex justify-between items-start mb-4">
        <span className="material-symbols-outlined text-brand-orange font-fill-1">{getIcon()}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:text-white text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
          <button className="p-1 hover:text-red-500 text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>

      {type === 'image' && metadata?.imageUrl && (
        <div className="h-40 -mx-5 -mt-2 mb-4 overflow-hidden">
          <img src={metadata.imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      {type === 'code' && (
        <div className="bg-surface-container-lowest p-3 rounded-md mb-3 font-mono text-[10px] text-brand-orange/80 overflow-hidden border border-white/5">
          <pre className="whitespace-pre-wrap">{content?.slice(0, 100)}...</pre>
        </div>
      )}

      <h4 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2">
        {title}
      </h4>
      
      {content && type !== 'code' && (
        <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 font-body">
          {content}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-auto">
        {tags?.map((tag) => (
          <span key={tag} className="text-[9px] font-bold tracking-tighter bg-surface-variant px-2 py-0.5 rounded uppercase text-on-surface-variant">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-label text-on-surface-variant">
          Capture: {getTimeAgo(createdAt)}
        </span>
        <span className="material-symbols-outlined text-sm text-on-surface-variant">more_horiz</span>
      </div>
    </div>
  );
};

export default CaptureCard;
