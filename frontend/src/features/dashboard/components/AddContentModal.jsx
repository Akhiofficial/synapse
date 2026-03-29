import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';

const AddContentModal = () => {
  const { isAddModalOpen, setIsAddModalOpen } = useDashboard();
  const [activeTab, setActiveTab] = useState('URL');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { label: 'URL', icon: 'link' },
    { label: 'Text', icon: 'notes' },
    { label: 'Image Upload', icon: 'image' },
    { label: 'YouTube Link', icon: 'play_circle' },
    { label: 'PDF Upload', icon: 'description' },
  ];

  if (!isAddModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-brand-black/90 backdrop-blur-2xl p-4 md:p-12"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full max-w-6xl glass-card border border-white/20 shadow-2xl shadow-brand-orange/10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsAddModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-all z-10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Header */}
          <div className="p-8 md:p-12 pb-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">Add Content</h2>
            <p className="text-on-surface-variant text-sm md:text-base font-body max-w-xl">
              Feed your digital consciousness. Upload documents, links, or text to expand your neural knowledge base.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 bg-white/5 p-1 rounded-2xl w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-label font-bold transition-all duration-300 ${
                    activeTab === tab.label
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Inputs */}
              <div className="space-y-8">
                {/* Conditional Inputs based on activeTab */}
                {(activeTab === 'URL' || activeTab === 'YouTube Link') && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                      {activeTab === 'URL' ? 'Content Identifier' : 'YouTube Video URL'}
                    </label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        placeholder={activeTab === 'URL' ? "https://..." : "https://youtube.com/watch?v=..."}
                        className="w-full bg-brand-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all outline-hidden font-body"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'Text' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Neural Text Content</label>
                    <textarea 
                      placeholder="Paste your thoughts or article text here..."
                      rows={6}
                      className="w-full bg-brand-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all outline-hidden font-body resize-none"
                    />
                  </div>
                )}

                {(activeTab === 'Image Upload' || activeTab === 'PDF Upload') && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                      {activeTab === 'Image Upload' ? 'Image File' : 'PDF Document'}
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 bg-white/5 flex flex-col items-center justify-center group hover:border-brand-orange/30 transition-colors cursor-pointer relative overflow-hidden">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept={activeTab === 'Image Upload' ? "image/*" : ".pdf"} />
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-brand-orange">
                          {activeTab === 'Image Upload' ? 'upload_file' : 'picture_as_pdf'}
                        </span>
                      </div>
                      <p className="text-sm text-white font-bold mb-1">Click to upload or drag and drop</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                        {activeTab === 'Image Upload' ? 'PNG, JPG or WEBP (MAX. 5MB)' : 'PDF (MAX. 10MB)'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Contextual Title (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Define this neural link"
                    className="w-full bg-brand-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all outline-hidden font-body"
                  />
                </div>

                <div className="flex gap-4 p-5 bg-brand-orange/10 rounded-2xl border border-brand-orange/10">
                  <span className="material-symbols-outlined text-brand-orange font-fill-1">info</span>
                  <p className="text-xs text-brand-orange/80 leading-relaxed font-body">
                    AI will automatically categorize and generate memory anchors for this content.
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-12 bg-white/2">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-on-surface-variant text-4xl">visibility_off</span>
                  </div>
                  <h4 className="text-white font-display font-bold text-xl mb-2">Visual Preview</h4>
                  <p className="text-on-surface-variant text-sm text-center font-body max-w-xs leading-relaxed">
                    Submit a URL to see the AI extracted metadata.
                  </p>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button className="bg-linear-to-br from-brand-orange to-orange-400 text-white font-bold py-5 px-10 rounded-2xl shadow-xl shadow-brand-orange/20 flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                    Save to Synapse
                    <span className="material-symbols-outlined font-fill-1">auto_awesome</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddContentModal;
