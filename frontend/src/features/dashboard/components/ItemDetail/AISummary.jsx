import React from 'react';

const AISummary = ({ summary }) => {
  return (
    <div className="glass-card p-6 border border-brand-orange/10">
      <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-brand-orange text-xl">auto_awesome</span>
        AI Summary
      </h3>
      <p className="text-on-surface-variant text-sm leading-relaxed font-body">
        {summary || "Our neural engine is still processing this insight. Check back shortly for a synthesized summary."}
      </p>
      
      <div className="mt-6 pt-4 border-t border-white/5">
        <button className="text-brand-orange text-[10px] font-bold tracking-widest uppercase hover:underline flex items-center gap-1 group">
          Explore Connections
          <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default AISummary;
