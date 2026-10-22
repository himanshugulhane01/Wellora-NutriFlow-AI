import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles, ArrowRight, Activity, ShieldCheck, Flame, Heart, Bot,
  ChevronDown, Star, Zap, Leaf, User, Utensils
} from 'lucide-react';

const HEADLINE_ROTATIONS = [
  { text: 'PCOS Relief', color: 'from-pink-500 to-rose-400' },
  { text: 'Diabetes Control', color: 'from-blue-500 to-cyan-400' },
  { text: 'Weight Loss', color: 'from-emerald-500 to-teal-400' },
  { text: 'Muscle Gain', color: 'from-orange-500 to-amber-400' },
  { text: 'Heart Health', color: 'from-red-500 to-pink-400' },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, text: 'Clinical Grade AI', color: 'text-emerald-500' },
  { icon: Activity, text: 'Real-Time GI Guard', color: 'text-blue-500' },
  { icon: Star, text: '4.9★ by 10K+ Users', color: 'text-amber-500' },
  { icon: Zap, text: '98.4% Macro Precision', color: 'text-purple-500' },
];

export const HeroSection: React.FC = () => {
  const {
    setIsAIModalOpen,
    setIsAuthModalOpen,
    setAuthModalDefaultMode,
    isAuthenticated,
    setCurrentView,
  } = useApp();
  const [rotationIdx, setRotationIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRotationIdx(i => (i + 1) % HEADLINE_ROTATIONS.length), 2800);
    return () => clearInterval(t);
  }, []);

  const currentHeadline = HEADLINE_ROTATIONS[rotationIdx];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      setAuthModalDefaultMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  const handleSignIn = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      setAuthModalDefaultMode('login');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section className="relative pt-10 pb-24 overflow-hidden">
      {/* Animated gradient background blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-400/10 via-orange-300/5 to-transparent rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* ── LEFT: Hero Text ── */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">

            {/* Top Pill */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-emerald-500/30 text-emerald-800 text-xs font-bold shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>India's First AI Clinical Nutrition Delivery Ecosystem</span>
            </div>

            {/* Main Headline with animated rotation */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] font-['Outfit']">
                Every Meal.
                <br />
                <span className={`bg-gradient-to-r ${currentHeadline.color} bg-clip-text text-transparent transition-all duration-700`}>
                  {currentHeadline.text}.
                </span>
                <br />
                <span className="text-slate-700">Delivered.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed pt-2">
                Personalized meals and nutrition guidance tailored to your preferences, goals, and health profile.
              </p>
            </div>

            {/* CTA Buttons — matching reference image */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              {/* Primary Green Pill Button: Explore Healthy Meals -> */}
              <button
                id="hero-get-started-btn"
                onClick={handleGetStarted}
                className="group h-13 px-8 rounded-full bg-[#03624C] hover:bg-[#024e3c] text-white font-extrabold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0"
              >
                <span>Explore Healthy Meals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* White Outline Pill Button: Meet Wellora AI */}
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="h-13 px-7 rounded-full bg-white hover:bg-emerald-50/50 text-[#03624C] font-extrabold text-sm border-2 border-[#03624C]/40 hover:border-[#03624C] transition-all flex items-center justify-center gap-2.5 shadow-xs shrink-0"
              >
                <Bot className="w-5 h-5 text-[#03624C]" />
                <span>Meet Wellora AI</span>
              </button>
            </div>

            {/* Trust Badges strip — 3 circular items with vertical dividers matching reference */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3">
              {/* Item 1: Personalized meal matching */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-[#03624C] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600 leading-tight max-w-[100px] text-left">
                  Personalized meal matching
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-px bg-slate-200" />

              {/* Item 2: Ingredient transparency */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-[#03624C] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600 leading-tight max-w-[100px] text-left">
                  Ingredient transparency
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-px bg-slate-200" />

              {/* Item 3: Flexible dietary preferences */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-[#03624C] shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600 leading-tight max-w-[110px] text-left">
                  Flexible dietary preferences
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Floating Meal Card ── */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg">

              {/* Main floating glass card */}
              <div className="relative p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Live AI Match • PCOS Relief</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#034B36] text-amber-300 border border-emerald-600/50">
                    98% Bio-Match
                  </span>
                </div>

                {/* Meal Image */}
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg group mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                    alt="AI Matched Healthy Bowl"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Floating pills */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[11px] font-bold shadow-md animate-bounce">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-slate-900">460 kcal</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[11px] font-bold shadow-md">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-900">38g Protein</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-black text-base font-['Outfit']">Avocado & Salmon Power Bowl</p>
                    <p className="text-xs text-slate-300 mt-0.5">Verde Botanical Kitchen • Ready in 18 min</p>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '3s' }} />
                    <p className="leading-snug text-[11px]">
                      <strong className="text-emerald-700">Wellora AI says:</strong> Lowers insulin spike by 42%. Safe for PCOS, lactose sensitivity & inflammatory response markers.
                    </p>
                  </div>
                </div>

                {/* Macro bar */}
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {[['460', 'kcal', 'text-orange-500'], ['38g', 'Protein', 'text-blue-500'], ['12g', 'Carbs', 'text-amber-500'], ['28g', 'Fat', 'text-emerald-500']].map(([v, l, c]) => (
                    <div key={l} className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                      <div className={`text-sm font-black ${c} font-['Outfit']`}>{v}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating widget — health score */}
              <div className="absolute -bottom-4 -left-8 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl animate-bounce" style={{ animationDuration: '3.5s' }}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Wholesome & Fresh</div>
                  <div className="text-sm font-black text-slate-900 font-['Outfit']">Clinical Chef Prepared</div>
                </div>
              </div>

              {/* Floating widget — veg badge */}
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-500/20 shadow-lg animate-bounce" style={{ animationDuration: '2.8s' }}>
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-800">100% Organic</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── IMPACT STATS BAR ── */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
          {[
            { val: '100K+', label: 'Healthy Meals Delivered', color: 'text-emerald-600' },
            { val: '10K+', label: 'Active Subscribers', color: 'text-blue-600' },
            { val: '500+', label: 'Certified Kitchens', color: 'text-amber-500' },
            { val: '98.4%', label: 'AI Macro Precision', color: 'text-orange-500' },
          ].map(({ val, label, color }) => (
            <div key={label} className="text-center py-8 px-4 bg-white space-y-1">
              <div className={`text-3xl sm:text-4xl font-extrabold font-['Outfit'] ${color}`}>{val}</div>
              <div className="text-xs font-semibold text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center mt-12 gap-2 text-slate-400 text-xs font-semibold animate-bounce">
          <span>Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </div>

      </div>
    </section>
  );
};
