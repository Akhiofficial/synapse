import React from 'react';

const ProximityItem = ({ title, matchPercentage, collaborators = 0, logo }) => (
    <div className="glass-card hover:bg-white/10 p-5 rounded-3xl transition-all hover:scale-105 border-white/5 cursor-pointer group">
        <div className="flex justify-between items-center mb-1">
            <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">{matchPercentage}% Match</span>
            {logo && <span className="material-symbols-outlined text-sm text-brand-orange">science</span>}
        </div>
        <h4 className="text-white font-display font-bold text-lg mb-2">{title}</h4>
        <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-brand-orange/40 border border-white/10 flex items-center justify-center text-[8px] font-bold">A</div>
                <div className="w-6 h-6 rounded-full bg-blue-500/40 border border-white/10 flex items-center justify-center text-[8px] font-bold">B</div>
             </div>
             <span className="text-[10px] text-on-surface-variant font-medium">+{collaborators} Neural Links</span>
        </div>
    </div>
);

const NeuralProximitySidebar = ({ relatedCollections = [] }) => {
  return (
    <aside className="w-full lg:w-96 shrink-0 lg:sticky lg:top-32 space-y-12">
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-brand-orange uppercase font-label tracking-widest text-[10px] font-bold">
            <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse shadow-lg shadow-brand-orange/50"></div>
            Neural Proximity
        </div>
        
        <div className="space-y-4">
            {relatedCollections.length > 0 ? (
                relatedCollections.map((col, index) => (
                    <ProximityItem key={index} {...col} />
                ))
            ) : (
                <>
                    <ProximityItem title="Project Beta" matchPercentage={88} collaborators={3} logo={true} />
                    <ProximityItem title="AI Ethics" matchPercentage={62} collaborators={1} />
                    <ProximityItem title="Synaptic Map V2" matchPercentage={45} collaborators={5} />
                </>
            )}
        </div>
      </div>
    </aside>
  );
};

export default NeuralProximitySidebar;
