import React, { useState, useEffect } from 'react';

const HighlightTrigger = ({ selection, onHighlight, onAddNote, containerRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (selection && selection.text && selection.range) {
      const rect = selection.range.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate position relative to container
      setPosition({
        top: rect.top - containerRect.top - 50, // 50px above the selection
        left: rect.left - containerRect.left + (rect.width / 2)
      });
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [selection, containerRef]);

  if (!visible) return null;

  return (
    <div 
      className="absolute z-50 transform -translate-x-1/2 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-center gap-1 p-1 bg-brand-black/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-brand-orange/20">
        <button 
          onClick={() => onHighlight(selection.text)}
          className="flex items-center gap-2 px-4 py-2 hover:bg-brand-orange text-white rounded-full transition-all group"
        >
          <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">edit</span>
          <span className="text-[11px] font-bold uppercase tracking-wider">Highlight</span>
        </button>
        
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        
        <button 
          onClick={() => onAddNote(selection.text)}
          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-white/80 hover:text-white rounded-full transition-all group"
        >
          <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">add_comment</span>
          <span className="text-[11px] font-bold uppercase tracking-wider">Note</span>
        </button>
      </div>
      
      {/* Pointer arrow */}
      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-brand-black/90 border-r border-b border-white/10 rotate-45"></div>
    </div>
  );
};

export default HighlightTrigger;
