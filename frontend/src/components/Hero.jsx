import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Play, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-48 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-medium mb-8 border border-brand-orange/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>V2.5 IS NOW LIVE</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-10 max-w-5xl"
        >
          Synthesize the <span className="text-brand-orange">Singularity</span> <br />
          of Your Thought
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed"
        >
          The first AI-powered second brain that doesn't just store your data—it understands it. 
          Connect articles, PDFs, tweets, and videos into a living neural map.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6 justify-center"
        >
          <button className="btn-primary h-14 px-10 text-lg flex items-center justify-center gap-3">
            Get Started for Free <MousePointer2 className="w-5 h-5" />
          </button>
          <button className="btn-secondary h-14 px-10 text-lg flex items-center justify-center gap-3 bg-white/5 border-white/10 hover:bg-white/10">
            <Play className="w-5 h-5 fill-current" /> Watch the Demo
          </button>
        </motion.div>
        
        {/* Glass Mockup Illustration Placeholder */}
        <motion.div
           initial={{ opacity: 0, y: 50, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="mt-28 w-full max-w-6xl relative group"
        >
          <div className="absolute inset-0 bg-brand-orange/20 blur-[120px] -z-10 group-hover:bg-brand-orange/30 transition-colors duration-500" />
          <div className="glass-card p-2 md:p-4 rotate-x-6">
            <div className="rounded-xl overflow-hidden bg-[#080808] aspect-video border border-white/5 relative">
              <img 
                src="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJjMDFhMTRkNzUzNzQyYmViOThkNTI5NDY2OWQ2NGExEgsSBxCd8qvRlxYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTkyNzIwMDIxMDY2Mjk3NDg4MQ&filename=&opi=89354086" 
                className="w-full h-full object-cover opacity-80"
                alt="Synapse Interface Mockup"
                onError={(e) => {
                   e.target.style.display = 'none';
                   e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0  flex-col items-center justify-center text-center hidden">
                 <div className="w-20 h-20 rounded-full bg-brand-orange/20 flex items-center justify-center mb-6">
                   <div className="w-4 h-4 bg-brand-orange rounded-full animate-ping" />
                 </div>
                 <h4 className="text-2xl font-display font-bold text-white mb-2">NEURAL ENGINE ACTIVE</h4>
                 <p className="text-brand-orange/60 font-mono tracking-widest text-sm uppercase">Mapping Knowledge Graph...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
