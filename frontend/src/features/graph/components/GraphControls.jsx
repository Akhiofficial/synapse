import React from 'react';

const GraphControls = ({ topics, selectedTopic, onTopicSelect, onSearch, nodeCount }) => {
  return (
    <div className="absolute top-8 right-8 w-80 glass-panel rounded-2xl p-6 shadow-2xl z-30 flex flex-col gap-6 font-display">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-orange/60 mb-3 block">Neural Search</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">search</span>
          <input 
            type="text"
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-brand-orange/50 outline-none transition-all text-white" 
            placeholder="Locate synapse..." 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-orange/60 mb-3 block">Filter Clusters</label>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onTopicSelect(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!selectedTopic ? 'bg-brand-orange text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            #All
          </button>
          {topics.map(topic => (
            <button 
              key={topic}
              onClick={() => onTopicSelect(topic)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selectedTopic === topic ? 'bg-brand-orange text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              #{topic}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
          {nodeCount} Synapses Linked
        </span>
        <button className="hover:text-white transition-colors">Reset View</button>
      </div>
    </div>
  );
};

export default GraphControls;
