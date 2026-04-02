import React from 'react';

const AIContextSummary = ({ summary }) => {
  return (
    <div className="relative overflow-hidden group mb-16">
      <div className="absolute inset-0 bg-brand-orange/5 blur-3xl rounded-full -top-1/2 -left-1/4 scale-150 transition-all group-hover:scale-175 opacity-20 group-hover:opacity-30 duration-700"></div>
      <div className="glass-card p-10 relative z-10 border-brand-orange/10 bg-brand-orange/5 group-hover:bg-brand-orange/10 transition-colors">
        <div className="flex items-start gap-8 flex-col lg:flex-row">
          <div className="bg-brand-orange/10 p-5 rounded-3xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-brand-orange/20">
            <span className="material-symbols-outlined text-brand-orange text-4xl font-fill-1">auto_awesome</span>
          </div>
          <div className="space-y-6">
            <h3 className="text-brand-orange font-display text-xl font-bold tracking-wider uppercase">AI Context Summary</h3>
            <p className="text-white lg:text-2xl font-light leading-relaxed tracking-wide opacity-90 group-hover:opacity-100 transition-opacity">
              {summary || "Synthesizing collective intelligence across your neural nodes. This collection represents a unique intersection of themes and patterns within your second brain. Add more content to generate a deeper contextual analysis."}
            </p>
            <div className="pt-4 flex gap-8 text-on-surface-variant/60 font-medium text-sm">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                    <span>Synthesis active</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">analytics</span>
                    <span>88% Accuracy</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIContextSummary;
