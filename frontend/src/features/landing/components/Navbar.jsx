import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass-nav px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-tight">Synapse</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-slate-300 font-medium absolute left-1/2 -translate-x-1/2">
          <a href="#features" className="hover:text-brand-orange transition-colors">Product</a>
          <a href="#features" className="hover:text-brand-orange transition-colors">Features</a>
          <a href="#graph" className="hover:text-brand-orange transition-colors">Graph</a>
          <a href="#pricing" className="hover:text-brand-orange transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-brand-orange transition-colors">Docs</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-slate-300 font-medium hover:text-white transition-colors">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
