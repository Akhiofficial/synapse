import React from 'react';

const ItemContent = ({ item }) => {
  const { type, title, content, metadata, createdAt, tags } = item;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getReadTime = (text) => {
    if (!text) return '1 min read';
    const words = text.split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  return (
    <div className="flex flex-col">
      {/* Header Meta */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-bold tracking-widest px-3 py-1 rounded uppercase">
            {type}
          </span>
          <div className="flex gap-2">
            {tags?.map((tag) => (
              <span key={tag} className="text-on-surface-variant text-[10px] font-bold tracking-tighter opacity-70 hover:opacity-100 transition-opacity uppercase cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-6xl text-white leading-[1.1] tracking-tight max-w-4xl">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[11px] font-label text-on-surface-variant uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            {formatDate(createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {getReadTime(content)}
          </div>
          <div className="flex items-center gap-2 text-brand-orange">
            <span className="material-symbols-outlined text-sm font-fill-1">auto_awesome</span>
            Synthesized by Synapse
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative group">
        <button className="absolute -top-4 right-8 z-10 bg-brand-orange text-white px-6 py-3 rounded-full font-display font-bold text-sm shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">edit</span>
          Add Highlight
        </button>

        <div className="glass-card p-12 md:p-16 border border-white/5 relative overflow-hidden">
          {/* Content Body */}
          <div className="prose prose-invert prose-orange max-w-none">
            <div className="text-xl md:text-2xl font-body leading-relaxed text-on-surface-variant font-light first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-orange first-letter:mr-3 first-letter:float-left">
              {content || "No detailed content extracted yet. Sync with your synaptic processor to reveal the depth."}
            </div>
            
            {/* Visual Assets if any */}
            {(type === 'image' || metadata?.imageUrl) && (
              <div className="my-12 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 group/img relative">
                <img 
                  src={metadata?.imageUrl || metadata?.thumbnailUrl} 
                  alt={title}
                  className="w-full h-auto object-cover group-hover/img:scale-[1.02] transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
              </div>
            )}
            
            {/* YouTube Embed Placeholder */}
            {type === 'youtube' && (
              <div className="my-12 aspect-video rounded-3xl overflow-hidden border border-white/10">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${metadata?.videoId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none -mr-48 -mt-48"></div>
        </div>
      </div>
    </div>
  );
};

export default ItemContent;
