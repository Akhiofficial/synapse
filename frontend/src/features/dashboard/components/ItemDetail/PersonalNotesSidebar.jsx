import React, { useState } from 'react';

const PersonalNotesSidebar = ({ highlights, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (highlight) => {
    setEditingId(highlight._id);
    setEditValue(highlight.note || '');
  };

  const saveEdit = (id) => {
    onEdit(id, editValue);
    setEditingId(null);
  };

  const formatDate = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
          Personal Notes
          <span className="bg-brand-orange/20 text-brand-orange text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">
            {highlights.length} ACTIVE
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {highlights.length === 0 ? (
          <div className="glass-card p-8 text-center border-dashed border-white/5 opacity-40">
            <span className="material-symbols-outlined text-3xl mb-2">edit_note</span>
            <p className="text-sm font-label uppercase tracking-widest">No highlights yet</p>
          </div>
        ) : (
          highlights.map((h) => (
            <div 
              key={h._id} 
              className="group relative glass-card p-6 border-white/5 hover:border-brand-orange/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(255,107,53,0.15)] overflow-hidden"
            >
              {/* Highlight bioluminescent border effect */}
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-brand-orange transition-all duration-700"></div>
              
              <div className="flex flex-col gap-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between text-[10px] font-label text-on-surface-variant uppercase tracking-widest opacity-60">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">format_quote</span>
                    "{h.text.substring(0, 20)}..."
                  </span>
                  <span>{formatDate(h.createdAt)}</span>
                </div>

                {/* Content Body */}
                <div className="relative">
                  {editingId === h._id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-hidden focus:border-brand-orange/50 transition-colors resize-none"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveEdit(h._id)}
                          className="text-[10px] font-bold uppercase tracking-widest bg-brand-orange text-white px-3 py-1 rounded-sm hover:scale-105 transition-all"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant leading-relaxed font-body italic group-hover:text-white/80 transition-colors">
                      {h.note || "No additional commentary added to this neural insight."}
                    </p>
                  )}
                </div>

                {/* Inline Action Bar */}
                <div className="flex justify-end gap-3 pt-3 mt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button 
                    onClick={() => handleEdit(h)}
                    className="text-white/40 hover:text-brand-orange transition-colors"
                    title="Edit Note"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button 
                    onClick={() => onDelete(h._id)}
                    className="text-white/40 hover:text-red-500 transition-colors"
                    title="Delete Highlight"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-brand-orange/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))
        )}
      </div>

      {/* AI Connection Status */}
      <div className="mt-8 glass-card p-4 border-l-2 border-brand-orange/40 bg-brand-orange/5 flex items-start gap-3">
        <span className="material-symbols-outlined text-brand-orange text-lg">info</span>
        <p className="text-[10px] text-on-surface-variant leading-tight">
          AI is currently analyzing {highlights.length + 11} related papers in your vault to find semantic connections to these notes.
        </p>
      </div>
    </div>
  );
};

export default PersonalNotesSidebar;
