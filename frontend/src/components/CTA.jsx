import React from 'react';

const CTA = () => {
  return (
    <section className="py-48 px-6 bg-[#0c0c0c] border-y border-white/5">
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] -z-10" />
        
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-10 leading-tight">
          Ready to Evolve Your <span className="text-brand-orange">Intellect?</span>
        </h2>
        
        <p className="text-lg text-slate-500 mb-14 max-w-2xl mx-auto leading-relaxed">
          Join 50,000+ researchers, engineers, and creatives who are building their second brain with Synapse.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="btn-primary h-16 px-12 text-xl shadow-2xl shadow-brand-orange/20">
            Get Started for Free
          </button>
          <button className="h-16 px-12 text-xl font-bold border border-white/10 rounded-full hover:bg-white/5 transition-all text-white">
             Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
