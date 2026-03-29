import React from 'react';

const PersonalSynthesis = () => {
  return (
    <div className="mt-12">
      <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-brand-orange text-2xl">edit_note</span>
        Personal Synthesis
      </h3>
      
      <div className="glass-card p-8 min-h-[300px] flex flex-col group relative">
        <textarea
          placeholder="Add your thoughts or connect this to an existing project..."
          className="w-full h-full min-h-[200px] bg-transparent border-none outline-hidden text-lg text-white/80 placeholder-on-surface-variant/40 resize-none font-body leading-relaxed"
        />
        
        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center bg-transparent transition-all opacity-20 group-hover:opacity-100">
          <div className="flex gap-4">
            <button className="text-on-surface-variant hover:text-brand-orange transition-colors">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <button className="text-on-surface-variant hover:text-brand-orange transition-colors">
              <span className="material-symbols-outlined">link</span>
            </button>
          </div>
          <span className="text-[10px] font-label text-on-surface-variant italic">
            Auto-saving to Brain...
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalSynthesis;
