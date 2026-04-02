import React from 'react';

const CTA = () => {
  return (
    <section className="py-24 md:py-48 px-4 md:px-6 bg-[#0c0c0c] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-brand-orange/5 blur-[80px] md:blur-[120px] -z-10" />
        
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-8 md:mb-10 leading-tight">
          Ready to Evolve Your <span className="text-brand-orange">Intellect?</span>
        </h2>
        
        <p className="text-base md:text-lg text-slate-500 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed px-4">
          Join 50,000+ researchers, engineers, and creatives who are building their second brain with Synapse.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
          <button className="btn-primary h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl shadow-2xl shadow-brand-orange/20 w-full sm:w-auto">
            Get Started <span className="hidden sm:inline">for Free</span>
          </button>
          <button className="h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl font-bold border border-white/10 rounded-full hover:bg-white/5 transition-all text-white w-full sm:w-auto">
             Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
