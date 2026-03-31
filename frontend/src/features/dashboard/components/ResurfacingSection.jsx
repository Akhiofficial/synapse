import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResurfacingSection = ({ items }) => {
  const navigate = useNavigate();
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white line-clamp-1">Memory Resurfacing</h2>
          <p className="text-on-surface-variant font-body">Recall gems from your past thoughts.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div 
            key={item._id} 
            onClick={() => navigate(`/dashboard/item/${item._id}`)}
            className="glass-card p-6 flex gap-6 group hover:shadow-2xl hover:shadow-brand-orange/5 transition-all duration-500 cursor-pointer"
          >
            <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 relative">
              <img 
                src={item.metadata?.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNJeIlzf0OL-GYxXf-meFH6pP1ftgkRZRusfBqqqEE1d3QSicdXYWqcyIFhvwIqs7H9-Bv6qP_ryyzvpDa7tZIcm5CUcvMNdQpLUslTPaUXGydiTYxBUG8UOFrI4NhXTKtbfF4_FLqpTgyTXV_ttg6pv5lUd0VANo49XtH9a3FXxS5fPZt7vEJffWcaW6ZGztuf674_RmQnG_11cgB678mHmYhAm9lE4qYhp3yTBtt-1pUjuJ2lzH96yclsNXQjs-B3hGPrV_RK3vS'}
                alt={item.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-label text-[10px] tracking-widest text-brand-orange font-bold mb-2 uppercase">
                {item.resurfaceMsg || 'REVISIT THIS MEMORY'}
              </span>
              <h3 className="font-display text-xl font-bold mb-2 line-clamp-1">{item.title}</h3>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-secondary-container/40 text-secondary-container text-[10px] font-bold uppercase tracking-wider">
                  {item.type}
                </span>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">calendar_today</span>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResurfacingSection;
