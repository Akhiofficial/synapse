import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import MobileHeader from '../../dashboard/components/MobileHeader';
import { DashboardProvider } from '../../dashboard/store/DashboardContext';
import { AuthContext } from '../../auth/store/auth.context';
import { updateUserApi, deleteUserApi } from '../../auth/services/auth.api';

const SettingsContent = () => {
  const { user, setUser } = useContext(AuthContext);
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setAlias(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSyncConfiguration = async () => {
    try {
      setIsSyncing(true);
      setMessage({ type: '', text: '' });
      const response = await updateUserApi({ name: alias });
      setUser(response.user);
      setMessage({ type: 'success', text: 'Neural identity synchronized successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Synchronization failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: This will permanently erase your neural link and all stored data. This action cannot be undone. Proceed?')) {
      try {
        await deleteUserApi();
        setUser(null);
        window.location.href = '/login';
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to deactivate neural link.' });
      }
    }
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : '??';
  };

  return (
    <div className="flex h-screen bg-brand-black text-white overflow-hidden">
      {/* Main App Sidebar */}
      <Sidebar />
      <MobileHeader />

      {/* Settings Main Layout */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 relative transition-all duration-300">
        {/* Header */}
        <header className="px-6 md:px-12 py-16 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 bg-brand-black/80 backdrop-blur-2xl sticky top-0 z-20 gap-4">
          <div className="animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white">Core Configuration</h1>
            <p className="text-gray-400 mt-1 font-body text-xs md:text-sm">Fine-tune your neural interface and parameters.</p>
          </div>
          <div className="hidden md:flex items-center gap-6 animate-fade-in">
             <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-brand-orange transition-colors">notifications</span>
                <span className="text-xs font-bold text-gray-400">Alerts</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-orange to-orange-400 flex items-center justify-center font-bold border border-white/20 shadow-lg shadow-brand-orange/20 cursor-pointer hover:scale-105 active:scale-95 transition-all text-sm tracking-tighter">
                {getInitials(user?.name)}
             </div>
          </div>
        </header>

        {/* Full-Width Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-12 space-y-8 md:space-y-12 pb-32 max-w-5xl mx-auto w-full">
          
          {/* Status Message */}
          {message.text && (
            <div className={`p-4 rounded-xl border animate-fade-in ${
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sm">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                <span className="text-sm font-bold tracking-tight uppercase">{message.text}</span>
              </div>
            </div>
          )}

          {/* Profile Identity Section */}
          <section className="glass-card p-6 md:p-10 space-y-8 animate-fade-in border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="p-3 bg-brand-orange/10 rounded-xl">
                <span className="material-symbols-outlined text-brand-orange font-fill-1">account_circle</span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold">Profile Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Synapse Alias</label>
                <div className="relative group">
                   <input 
                     type="text" 
                     value={alias}
                     onChange={(e) => setAlias(e.target.value)}
                     className="w-full bg-brand-black border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-orange/50 transition-all font-body text-base md:text-lg group-hover:border-white/20"
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
                     className="w-full bg-brand-black/30 border border-white/5 rounded-xl px-5 py-4 text-gray-500 cursor-not-allowed font-body text-base md:text-lg"
                   />
                   <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/5">lock</span>
                </div>
              </div>
            </div>
          </section>

          {/* Hazard Zone */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-3xl p-6 md:p-10 space-y-8 animate-fade-in [animation-delay:300ms] shadow-2xl shadow-red-500/5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <span className="material-symbols-outlined text-red-500 font-fill-1">warning</span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-red-500 tracking-tight">Hazard Zone</h2>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 p-6 bg-black/20 rounded-2xl border border-red-500/10">
              <div className="space-y-2">
                <h3 className="font-bold text-lg md:text-xl text-white">Deactivate Neural Link</h3>
                <p className="text-gray-400 text-xs md:text-sm max-w-lg leading-relaxed font-body">
                  Permanently erase all synapse mappings and stored intelligence data from the core grid. 
                  <span className="block mt-2 font-black text-red-500/80 uppercase tracking-tighter text-[10px] md:text-xs">// THIS ACTION CANNOT BE UNDONE</span>
                </p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="w-full lg:w-auto whitespace-nowrap bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 active:scale-95 text-xs uppercase tracking-widest"
              >
                Delete Account
              </button>
            </div>
          </section>

          {/* Footer Save / Actions */}
          <div className="flex justify-center pt-8 border-t border-white/5">
             <button 
                onClick={handleSyncConfiguration}
                disabled={isSyncing}
                className={`w-full md:w-auto bg-linear-to-r from-brand-orange to-orange-600 text-white px-16 py-5 rounded-2xl font-black text-base md:text-lg tracking-widest uppercase shadow-2xl shadow-brand-orange/20 hover:scale-[1.02] active:scale-95 transition-all animate-slide-up [animation-delay:400ms] ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                {isSyncing ? 'Syncing...' : 'Sync Configuration'}
             </button>
          </div>

          {/* Background Decor */}
          <div className="h-20 md:h-32 opacity-10 pointer-events-none relative">
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
