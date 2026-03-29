import React, { useState, useRef, useEffect, useCallback } from 'react';
import HighlightTrigger from './HighlightTrigger';

const ItemContent = ({ item, highlights, onAddHighlight }) => {
  const { type, title, content, metadata, createdAt, tags } = item;
  const contentRef = useRef(null);
  const [selection, setSelection] = useState(null);

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

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const text = sel.toString().trim();
      if (text && contentRef.current.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        setSelection({ text, range });
      } else {
        setSelection(null);
      }
    } else {
      setSelection(null);
    }
  };

  // Clear selection on clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selection && !e.target.closest('.highlight-trigger')) {
        // We delay clearing to allow the trigger buttons to work
        setTimeout(() => {
          if (!window.getSelection().toString()) {
            setSelection(null);
          }
        }, 100);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selection]);

  const handleAddHighlight = async (text) => {
    await onAddHighlight(text);
    setSelection(null);
    window.getSelection().removeAllRanges();
  };

  const handleAddNote = (text) => {
    // For now, we'll just add the highlight and let the user edit the note in the sidebar
    // This matches the "bioluminescent" flow of "Add then Refine"
    onAddHighlight(text, "Drafting neural connection...");
    setSelection(null);
    window.getSelection().removeAllRanges();
  };

  // Function to render content with highlights
  const renderContent = useCallback(() => {
    if (!content) return "No detailed content extracted yet. Sync with your synaptic processor to reveal the depth.";
    
    if (!highlights || highlights.length === 0) return content;

    // Build a regex to match all highlighted texts
    // We sort by length descending to handle overlapping highlights (naive approach)
    const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);
    let parts = [content];

    sortedHighlights.forEach(h => {
      const newParts = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }

        const index = part.indexOf(h.text);
        if (index !== -1) {
          if (index > 0) newParts.push(part.substring(0, index));
          newParts.push(
            <mark 
              key={`${h._id}-${index}`} 
              className="bg-brand-orange/20 text-inherit border-b-2 border-brand-orange/40 transition-all hover:bg-brand-orange/40 hover:border-brand-orange cursor-pointer px-1 rounded-sm relative group/highlight"
            >
              {h.text}
              {h.note && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-black/90 backdrop-blur-md border border-white/10 rounded-lg text-[10px] text-white/80 opacity-0 group-hover/highlight:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                  {h.note}
                </span>
              )}
            </mark>
          );
          if (index + h.text.length < part.length) {
            newParts.push(part.substring(index + h.text.length));
          }
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  }, [content, highlights]);

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
      <div className="relative group/container" ref={contentRef} onMouseUp={handleMouseUp}>
        <HighlightTrigger 
          selection={selection} 
          onHighlight={handleAddHighlight}
          onAddNote={handleAddNote}
          containerRef={contentRef}
        />

        <div className="glass-card p-12 md:p-16 border border-white/5 relative overflow-hidden">
          {/* Content Body */}
          <div className="prose prose-invert prose-orange max-w-none">
            <div className="text-xl md:text-2xl font-body leading-relaxed text-on-surface-variant font-light first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-brand-orange first-letter:mr-3 first-letter:float-left whitespace-pre-wrap selection:bg-brand-orange/30">
              {renderContent()}
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
