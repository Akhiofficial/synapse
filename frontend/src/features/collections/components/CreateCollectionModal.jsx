import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollections } from '../store/CollectionsContext';
import { z } from 'zod';

const CreateCollectionModal = () => {
  const { isCreateCollectionModalOpen, setIsCreateCollectionModalOpen, addCollection, recentItems } = useCollections();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const collectionSchema = z.object({
    name: z.string().min(3, "Collection name must be at least 3 characters long"),
    description: z.string().max(200, "Description is too long (max 200 characters)").optional()
  });

  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    setError('');
    
    try {
      collectionSchema.parse({ name, description });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { createCollection, addItemToCollection } = await import('../services/collections.api');
      const data = await createCollection(name);
      
      if (data.success && data.collection) {
        addCollection(data.collection);
        
        // Seed with selected items
        if (selectedItems.length > 0) {
          for (const itemId of selectedItems) {
            // Skip dummy items
            if (itemId.toString().length > 10) {
              await addItemToCollection(data.collection._id, itemId).catch(console.error);
            }
          }
        }
        
        setIsCreateCollectionModalOpen(false);
        setName('');
        setDescription('');
        setSelectedItems([]);
      }
    } catch (err) {
      console.error('Failed to create collection', err);
      // Optional: show a toast error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateCollectionModalOpen) return null;

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
          className="relative w-full max-w-4xl glass-card border border-white/20 shadow-2xl shadow-brand-orange/10 overflow-hidden flex flex-col max-h-[85vh]"
        >
          <button 
            onClick={() => setIsCreateCollectionModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-all z-10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="p-8 md:p-10 pb-6">
            <h2 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">Create Collection</h2>
            <p className="text-on-surface-variant text-sm font-body max-w-xl">
              Cluster your memories into a specialized neural index.
            </p>

            {/* Error Banner */}
            {error && (
              <div className="mt-4 flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl items-center">
                <span className="material-symbols-outlined text-red-400 font-fill-1">error</span>
                <p className="text-red-300 text-sm font-body font-medium">{error}</p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-8 md:px-10 pb-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-brand-orange uppercase">Collection Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Quantum Physics Research"
                    className="w-full bg-brand-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all outline-hidden font-body"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Neural Context (Description)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly define the scope of this collection..."
                    rows={4}
                    className="w-full bg-brand-black/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all outline-hidden font-body resize-none"
                  />
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-brand-orange font-fill-1">rocket_launch</span>
                    <h4 className="text-white font-bold text-sm">Predictive Clustering</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-body">
                    By seeding this collection, the Synapse engine will automatically prioritize similar neural patterns in your future captures.
                  </p>
                </div>
              </div>

              <div className="flex flex-col h-full border-l border-white/5 pl-10">
                <label className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-4">Seed with memories ({selectedItems.length})</label>
                
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-2 [scrollbar-width:none]">
                  {recentItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedItems.includes(item.id)
                          ? 'bg-brand-orange/10 border-brand-orange/30 shadow-[0_4px_12px_rgba(255,95,31,0.1)]'
                          : 'bg-white/5 border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        selectedItems.includes(item.id) ? 'bg-brand-orange border-brand-orange' : 'border-white/20'
                      }`}>
                        {selectedItems.includes(item.id) && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h5 className="text-white text-xs font-bold truncate">{item.title}</h5>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{item.type}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                   <button 
                    onClick={handleCreate}
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-br from-brand-orange to-orange-400 text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-orange/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Generating...' : 'Generate Neural Link'}
                    {!isSubmitting && <span className="material-symbols-outlined font-fill-1">hub</span>}
                  </button>
                  <p className="text-[10px] text-on-surface-variant/60 font-medium">Synced with Predictive Engine v2.6</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateCollectionModal;
