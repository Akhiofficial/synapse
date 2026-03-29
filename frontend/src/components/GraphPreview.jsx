import React from 'react';
import { motion } from 'framer-motion';

const GraphPreview = () => {
  return (
    <section id="graph" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
             <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Your Mind, <span className="text-accent-gradient">Connected</span></h2>
             <p className="text-slate-400 max-w-lg text-lg leading-relaxed mb-8">
               Unlike traditional folder systems, Synapse maps your information based on its inherent meaning. This creates a living knowledge graph that evolves with your research.
             </p>
             <ul className="space-y-4">
                {['Automatic Edge Creation', 'Semantic Clustering', 'Topic Hubs', 'Cross-referencing'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-200">
                        <div className="w-2 h-2 rounded-full bg-brand-teal" />
                        <span>{item}</span>
                    </li>
                ))}
             </ul>
          </div>
          
          <div className="flex-1 w-full max-w-2xl relative">
             <div className="glass-card aspect-square relative overflow-hidden flex items-center justify-center p-8">
                {/* Visual mock of a graph */}
                <svg className="w-full h-full opacity-50" viewBox="0 0 400 400">
                    <defs>
                        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    
                    {/* Connections */}
                    {[
                        [100, 100, 200, 200],
                        [300, 100, 200, 200],
                        [100, 300, 200, 200],
                        [300, 300, 200, 200],
                        [50, 200, 100, 100],
                        [350, 200, 300, 100],
                    ].map((line, i) => (
                        <motion.line 
                            key={i}
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                            x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} 
                            stroke="#14b8a6" strokeWidth="1"
                        />
                    ))}
                    
                    {/* Nodes */}
                    {[
                        [200, 200, 12], [100, 100, 8], [300, 100, 8], 
                        [100, 300, 8], [300, 300, 8], [50, 200, 6], [350, 200, 6]
                    ].map((node, i) => (
                        <motion.circle 
                            key={i}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring", duration: 1, delay: i * 0.05 }}
                            cx={node[0]} cy={node[1]} r={node[2]} 
                            fill="url(#nodeGrad)" 
                        />
                    ))}
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <span className="text-brand-teal text-6xl font-display font-bold animate-pulse">428</span>
                        <p className="text-slate-500 font-medium">Nodes Connected</p>
                    </div>
                </div>
                
                {/* Floating label bits */}
                <div className="absolute top-20 left-20 px-3 py-1 bg-brand-teal/10 rounded-full text-xs text-brand-teal border border-brand-teal/20 backdrop-blur-sm">Machine Learning</div>
                <div className="absolute bottom-40 right-10 px-3 py-1 bg-cyan-400/10 rounded-full text-xs text-cyan-400 border border-cyan-400/20 backdrop-blur-sm">Brain-Computer Interface</div>
                <div className="absolute top-1/2 right-20 px-3 py-1 bg-purple-400/10 rounded-full text-xs text-purple-400 border border-purple-400/20 backdrop-blur-sm">Neuroscience</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GraphPreview;
