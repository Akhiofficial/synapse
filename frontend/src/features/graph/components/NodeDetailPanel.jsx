import React from 'react';

const NodeDetailPanel = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="absolute top-8 left-8 w-72 glass-panel rounded-2xl p-6 shadow-2xl z-40 font-display animate-in slide-in-from-left duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-brand-orange/20 rounded-lg">
          <span className="material-symbols-outlined text-brand-orange text-sm font-fill-1">
            {node.type === 'article' ? 'description' : 
             node.type === 'youtube' ? 'play_circle' : 
             node.type === 'tweet' ? 'chat_bubble' : 'cloud'}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <h3 className="text-white font-bold leading-tight mb-2">{node.title}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {node.tags.map(tag => (
          <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full border border-brand-orange/20">
            #{tag}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 line-clamp-3 mb-6">
        Relational proximity with other nodes based on {node.topic} clustering.
      </p>

      <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
        Open Memory
        <span className="material-symbols-outlined text-xs">open_in_new</span>
      </button>
    </div>
  );
};

export default NodeDetailPanel;
