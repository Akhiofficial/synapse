import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import googleIcon from '../../../assets/google.png';

export default function SignupPage() {
  const { handleRegister, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (clearError) clearError();
    try {
      await handleRegister(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is already mapped in state, no need to alert
    }
  };

  return (
    <div className="text-white selection:bg-brand-orange selection:text-white min-h-screen flex flex-col items-center justify-center relative bg-brand-black w-full overflow-y-auto">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 radial-glow pointer-events-none z-0"></div>

      {/* TopNavBar */}
      <header className="absolute top-0 w-full z-50 flex justify-center items-center py-8 px-12 bg-transparent">
        <div className="w-full max-w-7xl flex justify-start items-center">
          <span className="text-2xl font-bold text-brand-orange tracking-tighter font-['Space_Grotesk']">
            Synapse
          </span>
        </div>
      </header>

      <main className="z-10 w-full px-6 flex flex-col items-center justify-center pt-32 pb-24">
        {/* Signup Container */}
        <div className="glass-card w-full max-w-md rounded-2xl p-10 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-3">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm font-body mx-auto leading-relaxed">
              Design your personalized intelligence center.
            </p>
          </div>

          {/* Social Logins */}
          <div className="w-full mb-8">
            <button className="flex w-full items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <img
                alt="Google Logo"
                className="w-5 h-5"
                src={googleIcon}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-white">
                Register with Google
              </span>
            </button>
          </div>

          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              OR EMAIL
            </span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="w-full space-y-5" onSubmit={onSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-4">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  person
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-transparent focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-slate-600 font-body text-sm transition-all duration-300 outline-none"
                  placeholder="Your Name"
                  type="text"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-4">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  alternate_email
                </span>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-transparent focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-slate-600 font-body text-sm transition-all duration-300 outline-none"
                  placeholder="neural@synapse.ai"
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-4">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  lock_open
                </span>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-transparent focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-slate-600 font-body text-sm transition-all duration-300 outline-none"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>

            {/* Primary CTA */}
            <button
              className="w-full btn-gradient py-4 rounded-full text-white font-display font-bold text-base tracking-tight hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">run_circle</span>
                  Registering...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm font-body text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-brand-orange font-semibold hover:underline decoration-brand-orange/30 underline-offset-4 ml-1 transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* System Decorative Image */}
        <div className="mt-12 opacity-40 hover:opacity-100 transition-opacity duration-700">
          <div className="w-24 h-px bg-linear-to-r from-transparent via-brand-orange/50 to-transparent"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full flex justify-between items-center px-12 py-6 bg-transparent pointer-events-none">
        <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] text-slate-600 opacity-80">
          © {new Date().getFullYear()} Synapse. Engineered Intelligence.
        </span>
        <div className="flex gap-6 pointer-events-auto">
          <a className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] text-slate-600 hover:text-slate-300 transition-colors" href="#">
            Privacy
          </a>
          <a className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] text-slate-600 hover:text-slate-300 transition-colors" href="#">
            Terms
          </a>
          <a className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] text-slate-600 hover:text-slate-300 transition-colors" href="#">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
