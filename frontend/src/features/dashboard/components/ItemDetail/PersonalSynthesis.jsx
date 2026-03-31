import React, { useState, useEffect, useRef } from 'react';

const PersonalSynthesis = ({ item, onUpdate }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const typingTimeoutRef = useRef(null);

  // Initialize from item if available
  useEffect(() => {
    if (item?.metadata?.personalSynthesis) {
      setContent(item.metadata.personalSynthesis);
    }
  }, [item]);

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    setStatus('Typing...');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      setStatus('Auto-saving to Brain...');
      try {
        if (onUpdate && item?._id) {
          await onUpdate(item._id, { 
            metadata: { 
              ...item.metadata, 
              personalSynthesis: val 
            } 
          });
          setStatus('Saved');
          setTimeout(() => setStatus(''), 2000);
        }
      } catch (error) {
        console.error('Save failed', error);
        setStatus('Error saving');
      }
    }, 1500);
  };

  return (
    <div className="mt-12">
      <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-brand-orange text-2xl">edit_note</span>
        Personal Synthesis
      </h3>
      
      <div className="glass-card p-8 min-h-[300px] flex flex-col group relative">
        <textarea
          value={content}
          onChange={handleChange}
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
          <span className="text-[10px] font-label text-brand-orange italic transition-opacity duration-300">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalSynthesis;
