import React from 'react';
import { useNavigate } from 'react-router-dom';

const RelatedInsights = ({ items }) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'article': return 'article';
      case 'image': return 'image';
      case 'youtube': return 'play_circle';
      case 'tweet': return 'chat';
      default: return 'bookmark';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          Related Insights
        </h3>
        <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded tracking-tighter uppercase">
          Smart Match
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {items?.map((item) => (
          <div 
            key={item._id}
            onClick={() => navigate(`/dashboard/item/${item._id}`)}
            className="glass-card p-4 hover:bg-surface-container-high/60 transition-all cursor-pointer group flex gap-4 items-center"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-brand-orange shrink-0">
              <span className="material-symbols-outlined text-lg">{getIcon(item.type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-display font-bold text-white truncate group-hover:text-brand-orange transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-label text-on-surface-variant uppercase tracking-wider">
                  {item.type}
                </span>
                <span className="text-[9px] text-on-surface-variant opacity-30">•</span>
                <span className="text-[9px] font-label text-on-surface-variant">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {(!items || items.length === 0) && (
          <div className="text-center py-8 opacity-40 text-xs italic">
            Connecting neural paths...
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedInsights;
