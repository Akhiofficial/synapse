import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Zap, Search, Video, FileText, Globe, MessageSquare } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Built for the <br /> <span className="text-brand-orange underline underline-offset-8 decoration-2">Hyper-Connected</span></h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Infinite Connections */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-10 flex flex-col justify-between group min-h-[400px]"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange/20 transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Infinite Connections</h3>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Watch as your disparate notes, web clips, and project ideas link together automatically through our autonomous semantic engine.
              </p>
            </div>
            
            <div className="mt-8 h-40 w-full relative overflow-hidden bg-brand-black/40 rounded-xl border border-white/5 flex items-center justify-center">
               <div className="absolute inset-0 bg-linear-to-br from-brand-orange/5 to-transparent" />
               <div className="flex gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-16 h-16 rounded-full border border-brand-orange/20 flex items-center justify-center bg-brand-orange/5 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                       <div className="w-2 h-2 bg-brand-orange rounded-full" />
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-10 border-brand-orange/10 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-orange-400 mb-6 group-hover:bg-orange-400/20 transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Insights</h3>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Every document you upload is instantly summarized, synapse-extracts key takeaways, action items, and identifies conflicting information across your library.
              </p>
            </div>
            
            <div className="mt-8 bg-black/60 rounded-xl border border-white/5 font-mono p-6 text-xs text-orange-200/60 shadow-inner">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-orange/40" />
                  <span className="uppercase tracking-widest font-bold">Neural Summary</span>
               </div>
               <p className="leading-relaxed">Based on 14 PDFs and 3 Videos: Your current research suggests a 24% increase in edge computing efficiency by 2026. Action item: Review Nvidia's latest architecture whitepaper.</p>
               <div className="mt-4 flex gap-2">
                  <span className="px-2 py-0.5 bg-brand-orange/10 rounded border border-brand-orange/20">Edge Computing</span>
                  <span className="px-2 py-0.5 bg-brand-orange/10 rounded border border-brand-orange/20">Nvidia</span>
               </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Semantic Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-10 flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="flex-1">
               <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500/20 transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Semantic Search</h3>
              <p className="text-slate-400 leading-relaxed">
                Search by meaning, not just keywords. Ask "What did I learn about sustainability last month?" and get curated results from every source.
              </p>
            </div>
            <div className="w-full md:w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center bg-radial from-brand-orange/20 to-transparent">
               <Search className="w-12 h-12 text-brand-orange/40 animate-pulse" />
            </div>
          </motion.div>

          {/* Multimodal Capture */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-card p-10 flex flex-col group"
          >
            <h3 className="text-xl font-bold mb-8">Multimodal Capture</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: Video, label: 'Videos' },
                 { icon: FileText, label: 'PDFs' },
                 { icon: Globe, label: 'Web' },
                 { icon: MessageSquare, label: 'Social' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-orange/30 transition-all cursor-default group/item">
                    <item.icon className="w-5 h-5 text-brand-orange/60 group-hover/item:text-brand-orange transition-colors" />
                    <span className="font-medium text-slate-300">{item.label}</span>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
