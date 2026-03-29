import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-orange animate-spin material-symbols-outlined text-4xl">
          progress_activity
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
       <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-white relative">
          <div className="fixed inset-0 radial-glow pointer-events-none z-0"></div>
          <div className="glass-card p-10 flex flex-col items-center text-center z-10 max-w-sm">
             <span className="material-symbols-outlined text-red-500 text-5xl mb-4">gpp_maybe</span>
             <h1 className="text-2xl font-display font-bold mb-2">Unauthorized</h1>
             <p className="text-slate-400 mb-6 text-sm">You need to log in to access this page.</p>
             <button onClick={() => window.location.href = '/login'} className="btn-gradient w-full py-3 rounded-full text-white font-bold tracking-wide">
                Sign In
             </button>
          </div>
       </div>
    );
  }

  return children ? children : <Outlet />;
}
