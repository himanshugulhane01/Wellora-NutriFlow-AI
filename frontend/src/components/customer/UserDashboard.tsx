import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BiometricScanner } from './BiometricScanner';
import { AIFoodWarningModal, analyzeFoodRisk } from './AIFoodWarningModal';
import type { FoodRiskWarning } from './AIFoodWarningModal';
import type { Meal } from '../../types';
import {
  Search, Star, Clock, Plus, Minus, ShieldCheck, Leaf,
  Flame, Bike, Sparkles, Bot, ChevronRight, Heart,
  Activity, ArrowRight, ShieldAlert, AlertTriangle, User,
  Utensils, Calendar, BarChart3, Target, RefreshCw, ShoppingBag
} from 'lucide-react';

interface FoodCategory {
  id: string;
  label: string;
  emoji: string;
  keywords: string[];
}

const DASHBOARD_CATEGORIES: FoodCategory[] = [
  { id: 'all',        label: 'All Foods',     emoji: '🌟', keywords: [] },
  { id: 'pizza',      label: 'Pizzas',         emoji: '🍕', keywords: ['pizza'] },
  { id: 'bowls',      label: 'Healthy Bowls', emoji: '🥗', keywords: ['bowl', 'salad', 'avocado', 'falafel'] },
  { id: 'burger',     label: 'Burgers',        emoji: '🍔', keywords: ['burger', 'sandwich'] },
  { id: 'protein',    label: 'High Protein',  emoji: '💪', keywords: ['protein', 'salmon', 'beef', 'chicken', 'keto'] },
  { id: 'low-sodium', label: 'Low Sodium',    emoji: '🥑', keywords: ['low sodium', 'bp safe', 'heart'] },
  { id: 'dessert',    label: 'Juices & Acai',  emoji: '🥤', keywords: ['acai', 'berry', 'smoothie'] },
];

export const UserDashboard: React.FC = () => {
  const {
    healthProfile, meals, cart, addToCart, removeFromCart,
    setCurrentView, setIsAIModalOpen, setIsOrderTrackingOpen,
    activeOrder, currentUser, setIsCartOpen, setIsProfileModalOpen,
    openProfileModal
  } = useApp();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [dashboardSearch, setDashboardSearch] = useState<string>('');
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  // Warning modal states for food ordering
  const [pendingMeal, setPendingMeal] = useState<Meal | null>(null);
  const [activeWarning, setActiveWarning] = useState<FoodRiskWarning | null>(null);

  const getCartQty = (mealId: string) => cart.find(i => i.meal.id === mealId)?.quantity || 0;
  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Derive risk status for meals based on today's scanned vitals
  const mealRisks = useMemo(() => {
    const map = new Map<string, FoodRiskWarning | null>();
    meals.forEach(meal => {
      map.set(meal.id, analyzeFoodRisk(meal, healthProfile.diseases, {
        bloodPressureSystolic:  healthProfile.bloodPressureSystolic,
        bloodPressureDiastolic: healthProfile.bloodPressureDiastolic,
        bloodSugarFasting:      healthProfile.bloodSugarFasting,
        cholesterolTotal:       healthProfile.cholesterolTotal,
        heartRateBpm:           healthProfile.heartRateBpm,
      }));
    });
    return map;
  }, [meals, healthProfile]);

  // Filter meals based on selected category & search query
  const filteredMeals = useMemo(() => {
    let result = meals;
    const cat = DASHBOARD_CATEGORIES.find(c => c.id === activeCategoryId);

    if (cat && cat.keywords.length > 0) {
      result = result.filter(m => {
        const name = m.name.toLowerCase();
        const catStr = m.categories.join(' ').toLowerCase();
        const badges = m.dietaryBadges.join(' ').toLowerCase();
        return cat.keywords.some(k => name.includes(k) || catStr.includes(k) || badges.includes(k));
      });
    }

    if (dashboardSearch.trim()) {
      const q = dashboardSearch.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.restaurantName.toLowerCase().includes(q) ||
        m.categories.some(c => c.toLowerCase().includes(q))
      );
    }
    return result;
  }, [meals, activeCategoryId, dashboardSearch]);

  const handleAddClick = (meal: Meal) => {
    const warning = mealRisks.get(meal.id);
    if (warning) {
      setPendingMeal(meal);
      setActiveWarning(warning);
    } else {
      addToCart(meal);
    }
  };

  const caloriesTarget = healthProfile.dailyCalorieTarget || 2000;
  const caloriesConsumed = Math.round(caloriesTarget * 0.72);
  const sys = healthProfile.bloodPressureSystolic || 142;
  const dia = healthProfile.bloodPressureDiastolic || 90;
  const isHighBP = sys >= 130;

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#07130F] pb-24">

      {/* ── 1. FOOD HERO & SEARCH BANNER ── */}
      <div className="bg-gradient-to-r from-[#034B36] via-[#055C43] to-[#0A3025] text-white px-4 sm:px-6 pt-8 pb-10 shadow-lg">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Top Bar: User Greeting & Active Order Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xl">
                🍕
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Hungry, {currentUser?.name || healthProfile.name || 'Foodie'}? 👋
                </p>
                <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight">
                  Order Gourmet & Healthy Meals
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Active Order Banner */}
              {activeOrder && (
                <button
                  onClick={() => setIsOrderTrackingOpen(true)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-300 hover:bg-orange-500/30 transition-all text-xs font-black"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                  <span>Order En Route ({activeOrder.etaMinutes}m)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* View Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 hover:bg-emerald-500/40 transition-all text-xs font-black text-emerald-200"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>View Cart</span>
                {totalCartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Subtitle & Search Bar */}
          <div className="max-w-2xl space-y-3">
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              Explore chef-prepared dishes guarded by real-time biometric AI protection.
            </p>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
              <input
                type="text"
                value={dashboardSearch}
                onChange={e => setDashboardSearch(e.target.value)}
                placeholder="Search pizzas, avocado bowls, burgers, biryani, smoothies..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/20 text-white placeholder:text-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm backdrop-blur-md shadow-inner transition-all"
              />
              {dashboardSearch && (
                <button
                  onClick={() => setDashboardSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. MAIN CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── 3. BIOMETRIC HEALTH SHIELD & SCANNER WIDGET (Sleek Consolidated Bar) ── */}
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 border border-emerald-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">BioScan™ Shield Active</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Live Guard
                </span>
              </div>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {isHighBP ? (
                  <span className="text-amber-300 flex items-center gap-1.5 inline-flex">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    High BP Scanned ({sys}/{dia} mmHg) • High Sodium Food Warnings Active
                  </span>
                ) : (
                  <span className="text-emerald-200">
                    Vitals Normal ({sys}/{dia} mmHg) • Safe for All Gourmet Meals
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowScannerModal(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-md"
            >
              <Activity className="w-4 h-4 text-emerald-200" />
              <span>{showScannerModal ? 'Close Scanner' : 'Scan Vitals Now'}</span>
            </button>
            <button
              onClick={() => openProfileModal('vitals')}
              className="px-3 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Edit Vitals
            </button>
          </div>
        </div>

        {/* Modal/Inline Biometric Scanner drawer when opened */}
        {showScannerModal && (
          <div className="bg-white dark:bg-[#091F17] rounded-3xl p-6 border border-emerald-500/20 shadow-xl relative animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                🔬 BioScan™ Instant Camera Vital Check
              </h3>
              <button
                onClick={() => setShowScannerModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close Scanner ✕
              </button>
            </div>
            <BiometricScanner />
          </div>
        )}

        {/* ── 4. FOOD CATEGORIES FILTER CHIPS ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Browse Gourmet Categories
            </h2>
            <button
              onClick={() => setCurrentView('marketplace')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Full Marketplace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {DASHBOARD_CATEGORIES.map(cat => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                      : 'bg-white dark:bg-[#091F17] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-emerald-500/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 5. GOURMET FOOD ORDERING GRID (MAJOR PRIMARY FEATURE) ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
              Featured Meals Available Now
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredMeals.length} dishes
            </span>
          </div>

          {filteredMeals.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#091F17] rounded-3xl border border-slate-200/80 dark:border-emerald-500/10 space-y-3">
              <div className="text-4xl">🍕</div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">No dishes found</h3>
              <p className="text-xs text-slate-400">Try searching for "pizza", "bowl", or selecting "All Foods"</p>
              <button
                onClick={() => { setActiveCategoryId('all'); setDashboardSearch(''); }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map(meal => {
                const qty = getCartQty(meal.id);
                const healthRisk = mealRisks.get(meal.id);
                const isRisky = !!healthRisk;
                const isBlock = healthRisk?.level === 'block';

                return (
                  <div
                    key={meal.id}
                    className={`group bg-white dark:bg-[#091F17] rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                      isBlock
                        ? 'border-red-500/40 ring-1 ring-red-500/20'
                        : isRisky
                          ? 'border-amber-400/50 ring-1 ring-amber-400/20'
                          : 'border-slate-200/80 dark:border-emerald-500/10'
                    }`}
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                        {/* Top Left Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {meal.isNutritionVerified && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[9px] font-black text-emerald-800 shadow">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          )}
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-[9px] font-black text-white shadow">
                            <Sparkles className="w-3 h-3" /> {meal.aiMatchScore}% Match
                          </span>
                        </div>

                        {/* Top Right Warning Badge */}
                        {isRisky && (
                          <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md text-[9px] font-black shadow-md ${
                            isBlock ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                          }`}>
                            <AlertTriangle className="w-3 h-3" />
                            <span>{isBlock ? 'HIGH BP ALERT' : 'HEALTH CAUTION'}</span>
                          </div>
                        )}

                        {/* Bottom image overlay */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                          <span className="text-emerald-300 font-extrabold truncate">{meal.restaurantName}</span>
                          <span className="flex items-center gap-1 bg-slate-900/70 px-2 py-0.5 rounded-lg">
                            <Clock className="w-3 h-3 text-amber-400" /> {meal.prepTime}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-black text-slate-900 dark:text-white font-['Outfit'] leading-tight">
                            {meal.name}
                          </h3>
                          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-black shrink-0">
                            <Star className="w-3 h-3 fill-amber-500" /> {meal.rating}
                          </div>
                        </div>

                        {/* High BP / Sodium Warning strip if risky */}
                        {isRisky && (
                          <div className={`p-2.5 rounded-xl border text-[10px] font-bold flex items-start gap-2 ${
                            isBlock
                              ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}>
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-black uppercase tracking-wider block">{healthRisk.reason}</span>
                              <span className="font-medium block leading-tight">{healthRisk.detail.slice(0, 90)}...</span>
                            </div>
                          </div>
                        )}

                        {/* Quick Macros info */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-center text-[10px]">
                          <div>
                            <span className="text-slate-400 block font-semibold">Calories</span>
                            <span className="font-black text-slate-900 dark:text-white">{meal.macros.calories} kcal</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold">Protein</span>
                            <span className="font-black text-blue-600 dark:text-blue-400">{meal.macros.protein}g</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold">GI Index</span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400">{meal.macros.glycemicIndex || 'GI 30'}</span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1">
                          {meal.dietaryBadges.slice(0, 3).map(b => (
                            <span key={b} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-black border border-emerald-500/15">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Price & Add Button */}
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Price</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">₹{meal.price}</span>
                      </div>

                      {qty === 0 ? (
                        <button
                          onClick={() => handleAddClick(meal)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all ${
                            isBlock
                              ? 'bg-amber-600 hover:bg-amber-500 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isBlock ? 'ADD (WARNING)' : 'ADD TO ORDER'}</span>
                        </button>
                      ) : (
                        <div className="flex items-center bg-emerald-600 text-white rounded-xl p-1 shadow-md">
                          <button onClick={() => removeFromCart(meal.id)} className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-lg">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-black">{qty}</span>
                          <button onClick={() => handleAddClick(meal)} className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-lg">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 6. QUICK SERVICES & PLATFORM FEATURES ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Utensils, title: 'Full Marketplace', sub: 'Explore 50+ dishes', view: 'marketplace' as const, color: 'from-emerald-500 to-teal-600' },
            { icon: Calendar, title: 'Meal Planner', sub: 'Plan your weekly diet', view: 'meal-planner' as const, color: 'from-blue-500 to-indigo-600' },
            { icon: BarChart3, title: 'Nutrition Logs', sub: 'Track calories & macros', view: 'nutrition-dashboard' as const, color: 'from-amber-500 to-orange-600' },
            { icon: Heart, title: 'Doctor Consult', sub: 'Book clinical advice', view: 'doctor-consultation' as const, color: 'from-red-500 to-pink-600' },
          ].map(({ icon: Icon, title, sub, view, color }) => (
            <button
              key={title}
              onClick={() => setCurrentView(view)}
              className="group flex flex-col items-center gap-3 p-5 rounded-3xl bg-white dark:bg-[#091F17] border border-slate-200/80 dark:border-emerald-500/10 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all text-center"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">{title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── 7. COMPACT DAILY MACRO SUMMARY LINE ── */}
        <div className="bg-white dark:bg-[#091F17] rounded-3xl p-5 border border-slate-200/80 dark:border-emerald-500/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              🔥
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white font-['Outfit']">
                Today's Nutrition Summary: {caloriesConsumed} / {caloriesTarget} kcal
              </p>
              <p className="text-[10px] text-slate-400">
                Macro targets balanced based on your scanned health profile
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('nutrition-dashboard')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View Macro Logs <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* AI Food Warning Modal (Pops up when user clicks ADD on Pizza or High Sodium/Sugar dishes with High BP) */}
      {pendingMeal && activeWarning && (
        <AIFoodWarningModal
          meal={pendingMeal}
          warning={activeWarning}
          onClose={() => {
            setPendingMeal(null);
            setActiveWarning(null);
          }}
          onProceedAnyway={() => {
            if (pendingMeal) {
              addToCart(pendingMeal);
            }
            setPendingMeal(null);
            setActiveWarning(null);
          }}
          onSelectAlternative={(altMeal) => {
            addToCart(altMeal);
            setPendingMeal(null);
            setActiveWarning(null);
          }}
        />
      )}

    </div>
  );
};

export default UserDashboard;
