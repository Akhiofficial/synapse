import React from 'react';

const Footer = () => {
  return (
    <footer className="py-24 px-6 bg-brand-black border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <div className="text-2xl font-display font-bold text-white mb-6">Synapse</div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Augmenting human cognition through intelligent, bioluminescent intelligence and predictive neural mapping.
          </p>
          <div className="mt-8 text-slate-700 text-[10px] tracking-widest uppercase">
            © 2026 Synapse Intelligence
          </div>
        </div>
        
        <div className="flex gap-16 lg:gap-32">
          <div>
            <h4 className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-6 underline underline-offset-4 decoration-1">Product</h4>
            <ul className="space-y-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-6 underline underline-offset-4 decoration-1">Resources</h4>
            <ul className="space-y-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-brand-orange transition-colors">API</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-6 underline underline-offset-4 decoration-1">Legal</h4>
            <ul className="space-y-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
