import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Flame, 
  Heart,
  Bot
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setIsAIModalOpen, healthProfile } = useApp();

  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 via-green-400/10 to-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
              <span>Next-Gen AI Personalized Nutrition Ecosystem</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08] font-['Outfit']">
              Every Meal.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Personalized
              </span>{' '}
              for Your Health.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              NutriFlow AI analyzes your medical profile, PCOS/diabetic markers, and daily macros to recommend & deliver chef-crafted meals from certified nutrition kitchens.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setCurrentView('marketplace')}
                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                <span>Start Eating Healthy</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsAIModalOpen(true)}
                className="px-7 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-200 dark:border-slate-700 shadow-md hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center gap-3"
              >
                <Bot className="w-5 h-5 text-blue-500" />
                <span>Talk to NutriBot AI</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Clinical Grade Recommendation</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>Real-Time Glycemic Index Guard</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Healthy Food Visualizer Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Interactive Floating Glass Card */}
            <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel shadow-2xl transition-transform hover:scale-[1.02] duration-500">
              
              {/* Top Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Live AI Meal Match
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  98% Match for {healthProfile.fitnessGoal}
                </span>
              </div>

              {/* 3D Food Image Container with Floating Badges */}
              <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                  alt="Healthy Salmon Power Bowl"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Floating Macro Pill #1 */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-md flex items-center gap-1.5 animate-float">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>460 kcal</span>
                </div>

                {/* Floating Macro Pill #2 */}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-md flex items-center gap-1.5 animate-float-reverse">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>38g Protein</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-lg font-['Outfit']">Avocado & Salmon Power Bowl</h4>
                  <p className="text-xs text-slate-200 line-clamp-1">Wild Salmon, Organic Quinoa, Low GI Dressing</p>
                </div>
              </div>

              {/* Animated AI Explanation Banner */}
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="leading-snug text-[11px]">
                    <strong className="text-emerald-600 dark:text-emerald-400">AI Diagnosis:</strong> Lowers insulin spike index by 42%. Verified safe for PCOS & lactose sensitivity.
                  </p>
                </div>
              </div>

            </div>

            {/* Floating Background Card Widget */}
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-float">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Health Score</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">92 / 100</div>
              </div>
            </div>

          </div>

        </div>

        {/* Impact Counters & Statistics Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-['Outfit']">100K+</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Healthy Meals Delivered</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-['Outfit']">10K+</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Subscribers</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-['Outfit']">500+</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Certified Kitchens</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-orange-500 font-['Outfit']">98.4%</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">AI Macro Precision</div>
          </div>
        </div>

      </div>
    </section>
  );
};
