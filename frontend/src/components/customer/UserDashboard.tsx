import React from 'react';
import { useApp } from '../../context/AppContext';
import { BiometricScanner } from './BiometricScanner';
import {
  Activity, Flame, Heart, Sparkles, Utensils,
  TrendingUp, TrendingDown, Bot, ChevronRight, Star, Clock, Plus,
  Calendar, Target, Zap, Award, BarChart3, ArrowRight, Leaf, User
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    healthProfile, meals, cart, addToCart, removeFromCart,
    setCurrentView, setIsAIModalOpen, setIsOrderTrackingOpen,
    activeOrder, currentUser
  } = useApp();

  const getCartQty = (mealId: string) => cart.find(i => i.meal.id === mealId)?.quantity || 0;

  // Derive targets from the actual user health profile
  const caloriesTarget = healthProfile.dailyCalorieTarget || 2000;
  const proteinTarget = healthProfile.dailyProteinTarget || Math.round(caloriesTarget * 0.3 / 4);
  const carbsTarget = healthProfile.dailyCarbTarget || Math.round(caloriesTarget * 0.4 / 4);
  const fatTarget = healthProfile.dailyFatTarget || Math.round(caloriesTarget * 0.3 / 9);
  const fiberTarget = 25;
  const waterTarget = Math.round(healthProfile.weightKg * 0.033);

  // Today's consumed values — in a real app these would come from NutritionLog API
  // For now, show partial progress (requires backend nutrition logging to be fully live)
  const caloriesConsumed = Math.round(caloriesTarget * 0.72);
  const proteinConsumed = Math.round(proteinTarget * 0.68);
  const carbsConsumed = Math.round(carbsTarget * 0.74);
  const fatConsumed = Math.round(fatTarget * 0.75);
  const fiberConsumed = 18;
  const waterConsumed = Math.round(waterTarget * 0.75);

  const caloriesPct = Math.round((caloriesConsumed / caloriesTarget) * 100);

  const macros = [
    { label: 'Protein', consumed: proteinConsumed, target: proteinTarget, unit: 'g', bg: 'bg-blue-500', text: 'text-blue-500' },
    { label: 'Fiber', consumed: fiberConsumed, target: fiberTarget, unit: 'g', bg: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Water', consumed: waterConsumed, target: waterTarget, unit: ' glasses', bg: 'bg-cyan-500', text: 'text-cyan-500' },
    { label: 'Carbs', consumed: carbsConsumed, target: carbsTarget, unit: 'g', bg: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Fat', consumed: fatConsumed, target: fatTarget, unit: 'g', bg: 'bg-orange-500', text: 'text-orange-500' },
  ];

  const todayMeals = [
    { time: '8:30 AM', name: 'Overnight Oats & Berries', kcal: 320, logged: true, icon: '🌅' },
    { time: '1:00 PM', name: 'Avocado & Salmon Bowl', kcal: 460, logged: true, icon: '🥑' },
    { time: '7:00 PM', name: 'Dinner not logged yet', kcal: 0, logged: false, icon: '🌙' },
  ];

  const weeklyData = [
    { day: 'Mon', kcal: 1820, target: caloriesTarget },
    { day: 'Tue', kcal: 2100, target: caloriesTarget },
    { day: 'Wed', kcal: 1650, target: caloriesTarget },
    { day: 'Thu', kcal: 1940, target: caloriesTarget },
    { day: 'Fri', kcal: 2050, target: caloriesTarget },
    { day: 'Sat', kcal: 1700, target: caloriesTarget },
    { day: 'Sun', kcal: caloriesConsumed, target: caloriesTarget, isToday: true },
  ];
  const maxKcal = Math.max(...weeklyData.map(d => d.kcal));

  const aiInsights = [
    { icon: '💡', text: 'Your GI intake is 18% above optimal today. Swap dinner carbs with green leafy vegetables.', tag: 'Glycemic Alert', color: 'amber' },
    { icon: '✅', text: 'Protein target 88% achieved — excellent for your PCOS muscle retention goal.', tag: 'Macro Win', color: 'emerald' },
    { icon: '💧', text: 'Hydration on track. Drink 400ml more before 9 PM to hit your 2.5L daily goal.', tag: 'Hydration', color: 'blue' },
  ];

  const recommendedMeals = meals.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#07130F] pb-20">
      {/* ── DASHBOARD HEADER ── */}
      <div className="bg-gradient-to-r from-[#034B36] to-[#0A3025] text-white px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
                  </p>
                  <h1 className="text-2xl font-black font-['Outfit']">
                    {currentUser?.name || healthProfile.name}
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {healthProfile.diseases.map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold">
                    {d}
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                  {healthProfile.fitnessGoal}
                </span>
              </div>
            </div>

            {/* Active Order Banner */}
            {activeOrder && (
              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-left"
              >
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <div>
                  <p className="text-xs font-bold text-orange-300">Order En Route</p>
                  <p className="text-sm font-black">ETA: {activeOrder.etaMinutes} mins</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60 ml-4" />
              </button>
            )}
          </div>

          {/* Quick stat cards */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Health Score', value: `${healthProfile.healthScore}/100`, icon: Heart, color: 'text-red-400', delta: '+4 this week' },
              { label: 'BMI', value: healthProfile.bmi.toFixed(1), icon: Activity, color: 'text-blue-400', delta: 'In healthy range' },
              { label: 'Daily Streak', value: '12 Days', icon: Zap, color: 'text-amber-400', delta: '🔥 Personal best!' },
              { label: 'Meals Logged', value: '2 of 3', icon: Utensils, color: 'text-emerald-400', delta: 'Dinner pending' },
            ].map(({ label, value, icon: Icon, color, delta }) => (
              <div key={label} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-lg font-black font-['Outfit']">{value}</div>
                <div className="text-[10px] text-white/60 mt-1">{delta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── ROW 0: Biometric Scanner + Vitals Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Biometric Scanner */}
          <div className="lg:col-span-1">
            <BiometricScanner />
          </div>

          {/* Live Vitals Summary Card */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0A1F16] rounded-3xl border border-slate-200 dark:border-emerald-500/15 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A1F16] to-slate-900 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Health Vitals</p>
                  <h3 className="text-base font-extrabold text-white font-['Outfit'] mt-0.5">Your Body Metrics Today</h3>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Update Manually →
                </button>
              </div>
            </div>
            <div className="p-5">
              {healthProfile.bloodPressureSystolic ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* BP */}
                  <div className="p-4 rounded-2xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 text-center">
                    <Heart className="w-5 h-5 text-red-500 mx-auto mb-2" />
                    <p className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
                      {healthProfile.bloodPressureSystolic}<span className="text-sm">/{healthProfile.bloodPressureDiastolic}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">BP mmHg</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block ${
                      healthProfile.bloodPressureSystolic >= 140 ? 'bg-red-500/15 text-red-500' :
                      healthProfile.bloodPressureSystolic >= 130 ? 'bg-orange-500/15 text-orange-500' :
                      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {healthProfile.bloodPressureSystolic >= 140 ? 'High' : healthProfile.bloodPressureSystolic >= 130 ? 'Elevated' : 'Normal'}
                    </span>
                  </div>
                  {/* Heart Rate */}
                  {healthProfile.heartRateBpm && (
                    <div className="p-4 rounded-2xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/15 text-center">
                      <Activity className="w-5 h-5 text-pink-500 mx-auto mb-2" />
                      <p className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">{healthProfile.heartRateBpm}<span className="text-xs"> bpm</span></p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Heart Rate</p>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {healthProfile.heartRateBpm <= 100 && healthProfile.heartRateBpm >= 60 ? 'Normal' : 'Check'}
                      </span>
                    </div>
                  )}
                  {/* Blood Sugar */}
                  {healthProfile.bloodSugarFasting && (
                    <div className="p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 text-center">
                      <Zap className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                      <p className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">{healthProfile.bloodSugarFasting}<span className="text-xs"> mg/dL</span></p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Blood Sugar</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block ${
                        healthProfile.bloodSugarFasting >= 126 ? 'bg-red-500/15 text-red-500' :
                        healthProfile.bloodSugarFasting >= 100 ? 'bg-orange-500/15 text-orange-500' :
                        'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {healthProfile.bloodSugarFasting >= 126 ? 'Diabetic' : healthProfile.bloodSugarFasting >= 100 ? 'Pre-Diabetic' : 'Normal'}
                      </span>
                    </div>
                  )}
                  {/* SpO2 */}
                  {healthProfile.oxygenSaturation && (
                    <div className="p-4 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/15 text-center">
                      <TrendingUp className="w-5 h-5 text-cyan-500 mx-auto mb-2" />
                      <p className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">{healthProfile.oxygenSaturation}<span className="text-xs">%</span></p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">SpO2</p>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Normal</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <div className="text-4xl">🔬</div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200">No vitals recorded yet</p>
                    <p className="text-xs text-slate-400 mt-1">Use the BioScan™ scanner on the left to check your BP,<br />heart rate, and blood sugar instantly</p>
                  </div>
                  <p className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                    💡 Your vitals help NutriBot AI warn you about unsafe food choices
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Calorie Ring */}
          <div className="bg-white dark:bg-[#091F17] rounded-3xl p-6 border border-slate-200/80 dark:border-emerald-500/10 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Today's Calorie Ring</h3>
            <div className="relative w-36 h-36">
              <svg className="w-36 h-36 -rotate-90">
                <circle cx="72" cy="72" r="58" fill="none" stroke="#e2e8f0" strokeWidth="12" className="dark:stroke-slate-800" />
                <circle
                  cx="72" cy="72" r="58" fill="none"
                  stroke="url(#caloGrad)" strokeWidth="12"
                  strokeDasharray={`${(caloriesPct / 100) * 364.4} 364.4`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="caloGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">{caloriesConsumed}</span>
                <span className="text-[10px] font-bold text-slate-400">of {caloriesTarget}</span>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{caloriesPct}%</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-black text-slate-900 dark:text-white">{caloriesTarget - caloriesConsumed} kcal</span> remaining today
            </div>
          </div>

          {/* Macros Progress */}
          <div className="md:col-span-2 bg-white dark:bg-[#091F17] rounded-3xl p-6 border border-slate-200/80 dark:border-emerald-500/10 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-5">Macro Guard Status</h3>
            <div className="grid grid-cols-2 gap-5">
              {macros.map(({ label, consumed, target, unit, bg, text }) => {
                const pct = Math.min(Math.round((consumed / target) * 100), 100);
                return (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">{label}</span>
                      <span className={`${text} font-black`}>{consumed}{unit} <span className="text-slate-400 font-normal">/ {target}{unit}</span></span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bg} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={`text-[10px] font-bold ${text}`}>{pct}% achieved</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ROW 2: Today's Meal Log + Weekly Chart ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Meal log */}
          <div className="bg-white dark:bg-[#091F17] rounded-3xl p-6 border border-slate-200/80 dark:border-emerald-500/10 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Today's Meal Log</h3>
              <button
                onClick={() => setCurrentView('nutrition-dashboard')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              >
                Full Log <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {todayMeals.map((meal, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-3.5 rounded-2xl border ${meal.logged ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-dashed border-slate-300 dark:border-slate-700 bg-transparent'}`}>
                  <span className="text-2xl">{meal.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${meal.logged ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{meal.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{meal.time}</p>
                  </div>
                  {meal.logged ? (
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 shrink-0">{meal.kcal} kcal</span>
                  ) : (
                    <button
                      onClick={() => setCurrentView('marketplace')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[10px] font-black shrink-0"
                    >
                      <Plus className="w-3 h-3" /> Order
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-white dark:bg-[#091F17] rounded-3xl p-6 border border-slate-200/80 dark:border-emerald-500/10 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">7-Day Calorie Chart</h3>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {weeklyData.map(({ day, kcal, isToday }) => {
                const heightPct = (kcal / maxKcal) * 100;
                const isOverTarget = kcal > caloriesTarget;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative" style={{ height: `${heightPct}%` }}>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          isToday
                            ? 'bg-gradient-to-t from-emerald-700 to-emerald-500'
                            : isOverTarget
                              ? 'bg-gradient-to-t from-amber-500/80 to-amber-400/60'
                              : 'bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600'
                        }`}
                        style={{ height: '100%' }}
                      />
                      {isToday && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          Today
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">{day}</span>
                  </div>
                );
              })}
            </div>
            {/* Target line label */}
            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <span className="w-6 h-px bg-dashed border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
              <span>Target: {caloriesTarget} kcal</span>
            </div>
          </div>
        </div>

        {/* ── ROW 3: AI Insights ── */}
        <div className="bg-gradient-to-r from-[#034B36] to-[#0A3025] rounded-3xl p-6 border border-emerald-500/20 shadow-xl text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="font-black text-sm font-['Outfit']">NutriBot AI Daily Insights</h3>
              <p className="text-[10px] text-emerald-300/70">Personalized for your {healthProfile.diseases.join(' & ')} profile</p>
            </div>
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask NutriBot</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map(({ icon, text, tag, color }, idx) => (
              <div key={idx} className={`p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{icon}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{tag}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 4: Quick Actions ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Utensils, label: 'Order Meals', sub: 'Browse marketplace', view: 'marketplace' as const, color: 'from-emerald-500 to-teal-500' },
            { icon: Calendar, label: 'Meal Planner', sub: 'Plan your week', view: 'meal-planner' as const, color: 'from-blue-500 to-indigo-500' },
            { icon: BarChart3, label: 'Nutrition Log', sub: 'Track macros', view: 'nutrition-dashboard' as const, color: 'from-amber-500 to-orange-500' },
            { icon: Heart, label: 'Doctor Care', sub: 'Book consult', view: 'doctor-consultation' as const, color: 'from-red-500 to-pink-500' },
          ].map(({ icon: Icon, label, sub, view, color }) => (
            <button
              key={label}
              onClick={() => setCurrentView(view)}
              className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white dark:bg-[#091F17] border border-slate-200/80 dark:border-emerald-500/10 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-slate-900 dark:text-white">{label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── ROW 5: AI Recommended Meals ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              AI-Matched Meals For You Today
            </h3>
            <button
              onClick={() => setCurrentView('marketplace')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {recommendedMeals.map(meal => {
              const qty = getCartQty(meal.id);
              return (
                <div key={meal.id} className="group bg-white dark:bg-[#091F17] rounded-3xl border border-slate-200/80 dark:border-emerald-500/10 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                  <div className="relative h-40">
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700 text-amber-400 text-[9px] font-black">
                      <Sparkles className="w-2.5 h-2.5" />
                      {meal.aiMatchScore}% Match
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-[9px] font-bold">
                      {meal.isNutritionVerified ? <Leaf className="w-3 h-3 text-green-500" /> : <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />}
                    </div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-xs font-black text-white line-clamp-1 font-['Outfit']">{meal.name}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" />{meal.macros.calories} kcal</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{meal.prepTime}</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{meal.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900 dark:text-white">₹{meal.price}</span>
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(meal)}
                          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all"
                        >
                          <Plus className="w-3 h-3" /> ADD
                        </button>
                      ) : (
                        <div className="flex items-center bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-xl overflow-hidden shadow">
                          <button onClick={() => removeFromCart(meal.id)} className="px-2.5 py-1.5 text-slate-500 hover:text-red-500 text-xs font-black">−</button>
                          <span className="px-2 font-black text-xs text-emerald-700 dark:text-emerald-400">{qty}</span>
                          <button onClick={() => addToCart(meal)} className="px-2.5 py-1.5 text-emerald-600 text-xs font-black">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ROW 6: Health Goals Progress ── */}
        <div className="bg-white dark:bg-[#091F17] rounded-3xl p-6 border border-slate-200/80 dark:border-emerald-500/10 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" /> Health Goals Tracker
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: 'Weight Progress', current: healthProfile.weightKg, target: healthProfile.targetWeightKg, unit: 'kg', icon: TrendingDown, color: 'text-emerald-600' },
              { label: 'Fitness Goal', current: 'PCOS Relief', target: 'Active', unit: '', icon: Award, color: 'text-blue-600' },
              { label: 'Activity Level', current: healthProfile.activityLevel, target: 'Very Active', unit: '', icon: TrendingUp, color: 'text-amber-600' },
            ].map(({ label, current, target, unit, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10">
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{current}{unit}</p>
                  <p className="text-[10px] text-slate-400">Target: {target}{unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
