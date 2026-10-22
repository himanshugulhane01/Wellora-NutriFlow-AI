import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services';
import { AdminDashboard } from '../dashboards/AdminDashboard';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Globe, 
  LogOut, 
  Eye, 
  EyeOff, 
  Sparkles,
  ShieldAlert,
  Server
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    setCurrentView,
    loginAndRedirect 
  } = useApp();

  // Check if current logged-in user has ADMIN role
  const isAdminLoggedIn = authService.isAuthenticated() && currentUser?.role === 'ADMIN';

  // Login form states for dedicated admin login screen
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Admin Login submission
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        if (res.data.user.role !== 'ADMIN') {
          setError('Access Denied: This account is not authorized with Administrator privileges.');
          setIsLoading(false);
          return;
        }
        await loginAndRedirect(res.data.user, res.data.token);
      } else {
        setError('Invalid administrator email or password.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Authentication failed. Please check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('wellora1111@gmail.com');
    setPassword('Himanshu@01');
    setError(null);
  };

  const handleAdminLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleReturnToWebsite = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'landing' }, '', '/');
    }
    setCurrentView('landing');
  };

  // ─── SCENARIO 1: NOT LOGGED IN AS ADMIN -> DEDICATED ADMIN LOGIN SCREEN ───
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Cyber glow background gradients */}
        <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[36rem] h-[36rem] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Minimal Admin Header */}
        <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-['Outfit'] text-white">
                WELLORA <span className="text-amber-400">ADMIN</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full">
                GATEWAY
              </span>
            </div>
          </div>

          <button
            onClick={handleReturnToWebsite}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all hover:scale-105"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Return to Main Website</span>
          </button>
        </header>

        {/* Dedicated Admin Login Card */}
        <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black font-['Outfit'] tracking-tight text-white">
                Administrator Authentication
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Restricted portal for system administrators to audit users, review live orders, and monitor AI telemetry.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@wellora.ai"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Open Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-fill Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Admin Credentials</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] border border-amber-500/40 transition-colors"
                >
                  Auto-fill Form
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>Email: <strong className="text-amber-400">wellora1111@gmail.com</strong></div>
                <div>Pass: <strong className="text-amber-400">Himanshu@01</strong></div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleReturnToWebsite}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <span>← Not an admin? Return to Wellora Website</span>
              </button>
            </div>

          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="px-6 py-4 border-t border-slate-800/60 text-center text-[11px] text-slate-500 relative z-10">
          Wellora Autonomous Clinical Health Systems • Restricted Administrative Facility • Internal Use Only
        </footer>
      </div>
    );
  }

  // ─── SCENARIO 2: LOGGED IN AS ADMIN -> FULL EXECUTIVE ADMIN DASHBOARD SUITE ───
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Dedicated Admin Suite Topbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">
                  WELLORA
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black tracking-wider text-amber-800 bg-amber-500/20 border border-amber-500/40 rounded-full uppercase">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5">
                Full-Stack Health & Operations Supervision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReturnToWebsite}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all hover:scale-105"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">View Consumer Website</span>
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-700 font-bold">{currentUser?.name || 'Administrator'}</span>
              <span className="text-[10px] text-amber-700 font-mono">({currentUser?.email})</span>
            </div>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 text-xs font-bold transition-all"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Dashboard View */}
      <main className="flex-1 pb-16">
        <AdminDashboard />
      </main>

    </div>
  );
};
