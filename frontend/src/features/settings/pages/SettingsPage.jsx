import React, { useState } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import { DashboardProvider } from '../../dashboard/store/DashboardContext';

const SettingsContent = () => {
  const [alias, setAlias] = useState('Alexander Vance');
  const [email, setEmail] = useState('vance.neural@aetheris.ai');
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('graph');
  const [apiKey, setApiKey] = useState('sk-synapse-89v...' + 'x'.repeat(24));

  return (
    <div className="flex h-screen bg-brand-black text-white overflow-hidden">
      {/* Main App Sidebar */}
      <Sidebar />

      {/* Settings Main Layout */}
      <div className="flex-1 flex flex-col ml-64 relative">
        {/* Header */}
        <header className="px-12 py-8 flex justify-between items-center border-b border-white/5 bg-brand-black/80 backdrop-blur-2xl sticky top-0 z-20">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">Core Configuration</h1>
            <p className="text-gray-400 mt-1 font-body text-sm">Fine-tune your neural interface and system parameters.</p>
          </div>
          <div className="flex items-center gap-6 animate-fade-in">
             <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-brand-orange transition-colors">notifications</span>
                <span className="text-xs font-bold text-gray-400">Alerts</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-orange to-orange-400 flex items-center justify-center font-bold border border-white/20 shadow-lg shadow-brand-orange/20 cursor-pointer hover:scale-105 active:scale-95 transition-all">
                AV
             </div>
          </div>
        </header>

        {/* Full-Width Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-12 space-y-12 pb-32 max-w-5xl mx-auto w-full">
          
          {/* Profile Identity Section */}
          <section className="glass-card p-10 space-y-8 animate-fade-in border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="p-3 bg-brand-orange/10 rounded-xl">
                <span className="material-symbols-outlined text-brand-orange font-fill-1">account_circle</span>
              </div>
              <h2 className="text-2xl font-display font-bold">Profile Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Synapse Alias</label>
                <div className="relative group">
                   <input 
                     type="text" 
                     value={alias}
                     onChange={(e) => setAlias(e.target.value)}
                     className="w-full bg-brand-black border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-orange/50 transition-all font-body text-lg group-hover:border-white/20"
                     placeholder="Enter your alias"
                   />
                   <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-orange/50 transition-colors">edit</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Secure Neural Email</label>
                <div className="relative group">
                   <input 
                     type="email" 
                     value={email}
                     readOnly
                     className="w-full bg-brand-black/30 border border-white/5 rounded-xl px-5 py-4 text-gray-500 cursor-not-allowed font-body text-lg"
                   />
                   <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/5">lock</span>
                </div>
              </div>
            </div>
          </section>

          {/* System Preferences Section */}
          <section className="glass-card p-10 space-y-8 animate-fade-in [animation-delay:100ms] border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="p-3 bg-brand-orange/10 rounded-xl">
                <span className="material-symbols-outlined text-brand-orange font-fill-1">settings_suggest</span>
              </div>
              <h2 className="text-2xl font-display font-bold">System Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Atmospheric Theme</label>
                <div className="flex bg-brand-black p-1.5 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-black transition-all ${theme === 'dark' ? 'bg-white/10 text-brand-orange shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Dark Void
                  </button>
                  <button 
                    onClick={() => setTheme('luminous')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-black transition-all ${theme === 'luminous' ? 'bg-white/10 text-brand-orange shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Luminous
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Default Cognitive View</label>
                <div className="relative group">
                  <select 
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className="w-full bg-brand-black border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-orange/50 appearance-none font-body text-lg transition-all cursor-pointer group-hover:border-white/20"
                  >
                    <option value="graph">Neural Graph View</option>
                    <option value="grid">Semantic Grid</option>
                    <option value="stream">Chronological Stream</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-brand-orange transition-colors">expand_more</span>
                </div>
              </div>
            </div>
          </section>

          {/* Access Protocol Section */}
          <section className="glass-card p-10 space-y-8 animate-fade-in [animation-delay:200ms] border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="p-3 bg-brand-orange/10 rounded-xl">
                <span className="material-symbols-outlined text-brand-orange font-fill-1">key</span>
              </div>
              <h2 className="text-2xl font-display font-bold">Access Protocol (API)</h2>
            </div>

            <div className="bg-brand-black rounded-3xl border border-white/5 p-8 relative overflow-hidden group shadow-inner">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-orange transition-all group-hover:w-2.5"></div>
               <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                  <div className="flex-1">
                     <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-black">Primary Production Key</p>
                     <p className="text-2xl md:text-3xl font-mono tracking-[0.3em] mt-3 text-white/40 break-all leading-relaxed whitespace-pre-wrap">
                        {apiKey.split('').map((char, i) => (i % 8 === 0 && i !== 0 ? ' ' + char : char)).join('')}
                     </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <p className="text-[10px] text-gray-500 font-black tracking-widest">ENCRYPTED PULSE ACTIVE</p>
                     <button className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-90 border border-white/5">
                        <span className="material-symbols-outlined text-2xl font-fill-1">content_copy</span>
                     </button>
                  </div>
               </div>

               <div className="flex justify-end gap-8 mt-10">
                  <button className="text-[10px] text-gray-500 hover:text-red-500 transition-all font-black uppercase tracking-[0.2em] border-b border-transparent hover:border-red-500">Revoke Master Key</button>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-full text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 active:scale-95 shadow-lg">
                     <span className="material-symbols-outlined text-sm">refresh</span>
                     Regenerate Protocol
                  </button>
               </div>
            </div>
          </section>

          {/* Hazard Zone */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-3xl p-10 space-y-8 animate-fade-in [animation-delay:300ms] shadow-2xl shadow-red-500/5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <span className="material-symbols-outlined text-red-500 font-fill-1">warning</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-red-500 tracking-tight">Hazard Zone</h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-6 bg-black/20 rounded-2xl border border-red-500/10">
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-white">Deactivate Neural Link</h3>
                <p className="text-gray-400 text-sm max-w-lg leading-relaxed font-body">
                  Permanently erase all synapse mappings and stored intelligence data from the core grid. 
                  <span className="block mt-2 font-black text-red-500/80 uppercase tracking-tighter text-xs">// THIS ACTION CANNOT BE UNDONE</span>
                </p>
              </div>
              <button className="whitespace-nowrap bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 active:scale-95 text-sm uppercase tracking-widest">
                Delete Account
              </button>
            </div>
          </section>

          {/* Footer Save / Actions */}
          <div className="flex justify-center pt-8 border-t border-white/5">
             <button className="bg-linear-to-r from-brand-orange to-orange-600 text-white px-16 py-5 rounded-2xl font-black text-lg tracking-widest uppercase shadow-2xl shadow-brand-orange/20 hover:scale-[1.02] active:scale-95 transition-all animate-slide-up [animation-delay:400ms]">
                Sync Configuration
             </button>
          </div>

          {/* Background Decor */}
          <div className="h-32 opacity-10 pointer-events-none relative">
             <div className="absolute inset-0 bg-linear-to-t from-brand-black to-transparent"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SettingsPage = () => (
  <DashboardProvider>
    <SettingsContent />
  </DashboardProvider>
);

export default SettingsPage;
