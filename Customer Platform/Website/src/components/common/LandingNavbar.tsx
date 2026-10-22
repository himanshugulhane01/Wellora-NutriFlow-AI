import React from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, Sun, LogIn } from 'lucide-react';

/**
 * LandingNavbar — styled exactly to match the user's reference design.
 * Features pill containers:
 * [Logo pill] [Navigation pill: How It Works, Healthy Meals, For Partners] [Sun pill] [Sign In pill]
 */
export const LandingNavbar: React.FC = () => {
  const {
    setCurrentView,
    setIsAuthModalOpen,
    setAuthModalDefaultMode,
  } = useApp();

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDashboardClick = () => {
    setCurrentView('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* ── Left: Brand Pill ── */}
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Green Leaf Brand Icon */}
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 fill-emerald-600 stroke-emerald-600" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-lg tracking-tight text-slate-900 font-['Outfit']">
                WELLORA
              </span>
              <span className="font-black text-lg tracking-tight text-emerald-600 font-['Outfit']">
                AI
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 tracking-tight mt-0.5">
              Personalized Healthcare & Food
            </span>
          </div>
        </div>

        {/* ── Middle: Navigation Links Pill ── */}
        <nav className="hidden md:flex items-center gap-8 px-6 py-2.5 bg-white rounded-full border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-emerald-700 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('healthy-meals')}
            className="hover:text-emerald-700 transition-colors"
          >
            Healthy Meals
          </button>
          <button
            onClick={() => handleNavClick('for-partners')}
            className="hover:text-emerald-700 transition-colors"
          >
            For Partners
          </button>
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-3">
          {/* Theme Indicator (Sun icon in round pill) */}
          <div
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-xs"
            title="Clean Light Mode"
          >
            <Sun className="w-4.5 h-4.5 text-slate-600 stroke-[2.2]" />
          </div>

          {/* Sign In CTA Button */}
          <button
            id="landing-signin-btn"
            onClick={() => {
              setAuthModalDefaultMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#03624C] hover:bg-[#024e3c] text-white text-xs font-extrabold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

      </div>
    </header>
  );
};
