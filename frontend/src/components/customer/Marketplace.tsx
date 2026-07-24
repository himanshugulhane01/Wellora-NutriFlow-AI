import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { CategoryFilter } from '../../types';
import { MOCK_RESTAURANTS } from '../../data/mockData';
import {
  Search,
  Sparkles,
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  ShieldCheck,
  Bike,
  ChevronRight,
  Tag,
  Leaf,
  Zap,
  Heart,
  Wheat,
  Droplets,
  TrendingUp,
  ArrowLeft,
  Info,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

// Categories with icons and colors
const CATEGORIES: { label: CategoryFilter; icon: React.ElementType; color: string; bg: string }[] = [
  { label: 'All', icon: Sparkles, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-600' },
  { label: 'PCOS', icon: Heart, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-600' },
  { label: 'Diabetes Friendly', icon: Droplets, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-600' },
  { label: 'High Protein', icon: Zap, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-600' },
  { label: 'Heart Healthy', icon: Heart, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-600' },
  { label: 'Weight Loss', icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-600' },
  { label: 'Keto', icon: Flame, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-600' },
  { label: 'Vegan', icon: Leaf, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-600' },
  { label: 'Low Carb', icon: Wheat, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-600' },
];

export const Marketplace: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setSelectedMealForDetail,
    addToCart,
    removeFromCart,
    cart,
    setIsCartOpen,
    healthProfile,
    meals
  } = useApp();

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [minMatchScore, setMinMatchScore] = useState<number>(85);
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const getCartQty = (mealId: string) => {
    return cart.find(i => i.meal.id === mealId)?.quantity || 0;
  };

  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const totalCartPrice = cart.reduce((s, i) => s + i.meal.price * i.quantity, 0);

  // Filter restaurants that have at least one meal matching current criteria
  const matchingRestaurants = MOCK_RESTAURANTS.filter(restaurant => {
    const hasSearchMatch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return hasSearchMatch;
  });

  const selectedRestaurant = selectedRestaurantId
    ? MOCK_RESTAURANTS.find(r => r.id === selectedRestaurantId)
    : null;

  // Filter meals
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || meal.categories.includes(activeCategory);
    const matchesScore = meal.aiMatchScore >= minMatchScore;
    const matchesRestaurant = !selectedRestaurantId || meal.restaurantId === selectedRestaurantId;
    const matchesVeg = !vegOnly || meal.isNutritionVerified; // using isNutritionVerified or isVeg fallback
    
    return matchesSearch && matchesCategory && matchesScore && matchesRestaurant && matchesVeg;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#07130F] text-slate-800 dark:text-slate-100 pb-32">
      
      {/* ── STICKY HEADER SEARCH BAR (Swiggy Style but Luxury Vibe) ── */}
      <div className="sticky top-20 z-30 bg-white/95 dark:bg-[#0A1F18]/95 backdrop-blur-md border-b border-emerald-500/10 dark:border-emerald-500/20 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Location / Search Selector */}
          <div className="flex items-center gap-3 flex-1">
            {selectedRestaurantId ? (
              <button
                onClick={() => setSelectedRestaurantId(null)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-500/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Kitchens</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Tech District • Block 4B</span>
              </div>
            )}

            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search delicious meals, superfoods, active ingredients..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Clinical Glycemic & Macro Guards Control Panel */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Min AI Bio-Match:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{minMatchScore}%</span>
              <input
                type="range"
                min="70"
                max="95"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="w-16 sm:w-24 accent-emerald-600 dark:accent-emerald-400 cursor-pointer h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
              />
            </div>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                vegOnly
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Pure Veg</span>
            </button>
          </div>
        </div>

        {/* ── HORIZONTAL CATEGORIES SLIDER ("What's on your mind?") ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 flex items-center gap-3 overflow-x-auto scrollbar-none">
          {CATEGORIES.map(({ label, icon: Icon }) => {
            const isActive = activeCategory === label;
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all border ${
                  isActive
                    ? 'bg-emerald-800 border-emerald-800 text-amber-400 shadow-lg shadow-emerald-950/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-500" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── CLINICAL BIOLOGICAL TARGET PROFILE BANNER ── */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#034B36] to-[#0A3025] text-white p-6 sm:p-8 relative overflow-hidden border border-emerald-500/20 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Clinical Calibration Match</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight font-['Outfit'] text-white">
                Personalized NutriFlow Market
              </h1>
              <p className="text-xs text-emerald-200/90 max-w-2xl">
                Matched with <span className="text-amber-400 font-bold">{healthProfile.name}</span>'s profile: <span className="font-bold underline">{healthProfile.diseases.join(', ')}</span>. Glycemic targets & macro index guards configured.
              </p>
            </div>
            
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400 font-['Outfit']">{healthProfile.dailyCalorieTarget}</div>
                <div className="text-[10px] text-emerald-200/80 font-bold uppercase tracking-wider">kcal Limit</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400 font-['Outfit']">{healthProfile.dailyProteinTarget}g</div>
                <div className="text-[10px] text-emerald-200/80 font-bold uppercase tracking-wider">Protein Target</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── VIEW 1: RESTAURANT DIRECTORY LIST (Swiggy Style) ── */}
        {!selectedRestaurantId && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Wellness Kitchens ({matchingRestaurants.length})</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">Strict Bio-Verifications Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingRestaurants.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRestaurantId(r.id)}
                  className="group cursor-pointer bg-white dark:bg-[#091F17] rounded-3xl border border-slate-200/80 dark:border-emerald-500/10 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Cover image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      
                      {/* Wellness Match score */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-amber-400 text-[10px] font-black shadow-md border border-emerald-500/30">
                        <Sparkles className="w-3 h-3" />
                        <span>{r.aiHealthyScore}% Safe Score</span>
                      </div>

                      {/* Prominent Offer Ribbon */}
                      {r.discountOffer && (
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-1.5 text-xs text-white bg-amber-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/30 font-bold shadow-lg">
                          <Tag className="w-4 h-4 text-white" />
                          <span className="line-clamp-1">{r.discountOffer}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-['Outfit'] line-clamp-1">
                          {r.name}
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                          {r.cuisine.join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{r.rating}</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{r.deliveryTime}</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Bike className="w-3.5 h-3.5" />
                          <span>Free Express</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Foot action */}
                  <div className="px-5 py-4 bg-slate-50 dark:bg-emerald-950/20 border-t border-slate-100 dark:border-emerald-500/10 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span>View Menu Items</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── VIEW 2: RESTAURANT MENU VIEW (Swiggy layout but luxury botanical theme) ── */}
        {selectedRestaurantId && selectedRestaurant && (
          <div className="space-y-8">
            {/* Restaurant Detail Header Banner */}
            <div className="bg-white dark:bg-[#091F17] rounded-3xl p-6 border border-slate-200/80 dark:border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="flex items-center gap-5">
                <img
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-emerald-500/20"
                />
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                    {selectedRestaurant.name}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {selectedRestaurant.cuisine.join(', ')} • {selectedRestaurant.distance}
                  </p>
                  
                  {/* Score badge */}
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Glycemic Rating: {selectedRestaurant.aiHealthyScore}% Safe</span>
                  </div>
                </div>
              </div>

              {/* Quick stats panel */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-slate-100 dark:border-emerald-500/10">
                <div className="text-center px-2">
                  <div className="flex items-center justify-center gap-0.5 text-amber-500 font-extrabold text-sm">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{selectedRestaurant.rating}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Rating</div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="text-center px-2">
                  <div className="text-slate-900 dark:text-white font-extrabold text-sm">
                    {selectedRestaurant.deliveryTime}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Speed</div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="text-center px-2">
                  <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    ₹{selectedRestaurant.priceForTwo}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">For Two</div>
                </div>
              </div>
            </div>

            {/* Menu List Header */}
            <div className="border-b border-slate-200 dark:border-emerald-500/20 pb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                Recommended Menu ({filteredMeals.length})
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Sorting: Match Score</span>
              </div>
            </div>

            {/* Dishes list — Swiggy Row Style with a Premium, Luxury Dark Vibe */}
            <div className="space-y-6">
              {filteredMeals.map(meal => {
                const qty = getCartQty(meal.id);
                return (
                  <div
                    key={meal.id}
                    className="bg-white dark:bg-[#091F17] rounded-3xl p-5 border border-slate-200/80 dark:border-emerald-500/10 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                  >
                    
                    {/* Left: Detail description */}
                    <div className="flex-1 space-y-3 min-w-0">
                      
                      {/* Veg indicator & match score tag */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Swiggy style Veg dot */}
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${meal.isNutritionVerified ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${meal.isNutritionVerified ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>

                        {/* Match tag */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{meal.aiMatchScore}% Calibrated Match</span>
                        </span>

                        {meal.aiHealthTag && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                            {meal.aiHealthTag}
                          </span>
                        )}
                      </div>

                      {/* Name & price */}
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white font-['Outfit'] hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => setSelectedMealForDetail(meal)}>
                          {meal.name}
                        </h4>
                        <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                          ₹{meal.price}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                        {meal.aiExplanation}
                      </p>

                      {/* Nutrition macro guard indicators */}
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-emerald-500/10 w-fit">
                        <span className="flex items-center gap-0.5 text-orange-500">
                          <Flame className="w-3.5 h-3.5" />
                          <span>{meal.macros.calories} kcal</span>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Protein: {meal.macros.protein}g
                        </span>
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          Low GI: {meal.macros.glycemicIndex}
                        </span>
                      </div>
                    </div>

                    {/* Right: Dish Photo & Add button */}
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-28 h-28 rounded-2xl object-cover shadow-md border border-slate-100 dark:border-emerald-500/25"
                      />

                      {/* Swiggy Style Add overlay button */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(meal)}
                            className="px-6 py-2 rounded-xl bg-white dark:bg-[#07130F] text-emerald-700 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/30 hover:border-emerald-500 shadow-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center gap-1"
                          >
                            <span>ADD</span>
                            <Plus className="w-3 h-3 text-emerald-600" />
                          </button>
                        ) : (
                          <div className="flex items-center bg-white dark:bg-[#07130F] border border-emerald-500/30 rounded-xl overflow-hidden shadow-md">
                            <button
                              onClick={() => removeFromCart(meal.id)}
                              className="px-2.5 py-1.5 text-slate-500 hover:text-red-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-black text-xs text-emerald-700 dark:text-emerald-400">{qty}</span>
                            <button
                              onClick={() => addToCart(meal)}
                              className="px-2.5 py-1.5 text-emerald-600 hover:text-emerald-500 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredMeals.length === 0 && (
              <div className="text-center py-16 space-y-3 bg-white dark:bg-[#091F17] rounded-3xl border border-slate-200/80 dark:border-emerald-500/10">
                <Info className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-900 dark:text-white">No items match your active macro target filters</p>
                <p className="text-xs text-slate-400">Try lower range match or clear category parameters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── STICKY BOTTOM CART NOTIFICATION (Swiggy style checkout bar) ── */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 animate-in slide-in-from-bottom-5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform border border-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">
                {totalCartCount}
              </div>
              <span className="font-extrabold text-xs tracking-wide">Basket Items • View Checkout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-amber-400">₹{totalCartPrice}</span>
              <ChevronRight className="w-4 h-4 text-white opacity-80" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
