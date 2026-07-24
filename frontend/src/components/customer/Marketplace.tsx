import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { CategoryFilter } from '../../types';
import { MOCK_MEALS, MOCK_RESTAURANTS } from '../../data/mockData';
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
  X,
  TrendingUp,
  Filter
} from 'lucide-react';

// Category config with icons and colors
const CATEGORIES: { label: CategoryFilter; icon: React.ElementType; color: string; bg: string }[] = [
  { label: 'All', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-500' },
  { label: 'PCOS', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-500' },
  { label: 'Diabetes Friendly', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-500' },
  { label: 'High Protein', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-500' },
  { label: 'Heart Healthy', icon: Heart, color: 'text-red-600', bg: 'bg-red-500' },
  { label: 'Weight Loss', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-500' },
  { label: 'Keto', icon: Flame, color: 'text-amber-600', bg: 'bg-amber-500' },
  { label: 'Vegan', icon: Leaf, color: 'text-green-600', bg: 'bg-green-500' },
  { label: 'Low Carb', icon: Wheat, color: 'text-teal-600', bg: 'bg-teal-500' },
];

const OFFER_BANNERS = [
  { id: 1, tag: 'Limited Offer', title: '50% OFF', subtitle: 'on first PCOS-Safe meal order', code: 'PCOS50', gradient: 'from-emerald-600 to-teal-500', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
  { id: 2, tag: 'Free Delivery', title: 'Orders ₹500+', subtitle: 'Free clinical express delivery', code: 'AUTO', gradient: 'from-violet-600 to-indigo-500', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80' },
  { id: 3, tag: 'New', title: 'AI Meal Plan', subtitle: 'Get 7-day personalized plan for ₹99', code: 'AIPLAN99', gradient: 'from-orange-500 to-rose-500', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80' },
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
  } = useApp();

  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [minMatchScore] = useState<number>(80);
  const [showFilters, setShowFilters] = useState(false);

  const getCartQty = (mealId: string) => {
    return cart.find(i => i.meal.id === mealId)?.quantity || 0;
  };

  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const totalCartPrice = cart.reduce((s, i) => s + i.meal.price * i.quantity, 0);

  const filteredMeals = MOCK_MEALS.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || meal.categories.includes(activeCategory);
    const matchesScore = meal.aiMatchScore >= minMatchScore;
    const matchesRestaurant = !selectedRestaurant || meal.restaurantId === selectedRestaurant;
    return matchesSearch && matchesCategory && matchesScore && matchesRestaurant;
  });

  const selectedRestaurantData = selectedRestaurant
    ? MOCK_RESTAURANTS.find(r => r.id === selectedRestaurant)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">

      {/* ── STICKY TOP SEARCH + LOCATION BAR ──────────────────────────── */}
      <div className="sticky top-20 z-30 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search meals, restaurants, ingredients...'
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${showFilters ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* ── HORIZONTAL CATEGORY CHIPS ─────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map(({ label, icon: Icon, color, bg }) => {
            const isActive = activeCategory === label;
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive
                    ? `${bg} text-white shadow-md`
                    : `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${color} hover:border-emerald-400`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── OFFER BANNERS CAROUSEL ─────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {OFFER_BANNERS.map((banner, idx) => (
              <div
                key={banner.id}
                className={`flex-shrink-0 w-72 sm:w-80 rounded-2xl bg-gradient-to-r ${banner.gradient} text-white overflow-hidden flex items-center gap-4 p-5 relative cursor-pointer hover:scale-[1.02] transition-transform shadow-lg`}
                onClick={() => setActiveBanner(idx)}
              >
                <div className="flex-1 z-10">
                  <span className="text-[10px] font-bold uppercase bg-white/25 px-2 py-0.5 rounded-full">{banner.tag}</span>
                  <div className="text-2xl font-black mt-1">{banner.title}</div>
                  <div className="text-xs opacity-80 mt-0.5">{banner.subtitle}</div>
                  <div className="mt-2 text-[11px] font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded-lg inline-block">
                    Code: {banner.code}
                  </div>
                </div>
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="w-20 h-20 object-cover rounded-xl opacity-80 flex-shrink-0"
                />
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="flex gap-1.5 justify-center">
            {OFFER_BANNERS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeBanner ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-300 dark:bg-slate-700'}`} />
            ))}
          </div>
        </div>

        {/* ── AI MATCH CONTEXT CARD ─────────────────────────────────────── */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between gap-4 shadow-lg shadow-emerald-600/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold opacity-80">AI Personalized for</div>
              <div className="font-extrabold text-sm">{healthProfile.name} • {healthProfile.diseases.join(', ')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-right flex-shrink-0">
            <div>
              <div className="font-black text-lg">{healthProfile.dailyCalorieTarget}</div>
              <div className="opacity-70 text-[10px]">Target kcal</div>
            </div>
            <div className="h-8 w-px bg-white/25" />
            <div>
              <div className="font-black text-lg">{healthProfile.dailyProteinTarget}g</div>
              <div className="opacity-70 text-[10px]">Protein</div>
            </div>
          </div>
        </div>

        {/* ── RESTAURANT CARDS ──────────────────────────────────────────── */}
        {!selectedRestaurant && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Nutrition-Verified Kitchens
              </h2>
              <span className="text-xs text-slate-500 font-medium">500+ partners</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_RESTAURANTS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRestaurant(r.id)}
                  className="group text-left rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400/60 transition-all duration-300"
                >
                  {/* Restaurant Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    {/* AI Score Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      <Sparkles className="w-2.5 h-2.5" />
                      {r.aiHealthyScore}% Health
                    </div>
                    {/* Discount badge */}
                    {r.offers && r.offers.length > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        {r.offers[0]}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-extrabold text-white text-sm font-['Outfit'] line-clamp-1">{r.name}</h3>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{r.cuisine.join(', ')}</p>
                    </div>
                  </div>

                  {/* Restaurant Meta */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />{r.rating}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3" />{r.deliveryTime}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Bike className="w-3 h-3 text-emerald-500" />Free
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── MEAL GRID ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {selectedRestaurant ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Restaurants
                </button>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                  {selectedRestaurantData?.name}
                </h2>
              </div>
            ) : (
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                AI Recommended — {filteredMeals.length} meals
              </h2>
            )}
            <span className="text-[11px] text-slate-400 font-medium">By health match %</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMeals.map(meal => {
              const qty = getCartQty(meal.id);
              return (
                <div
                  key={meal.id}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400/60 transition-all duration-300 flex flex-col"
                >
                  {/* Meal Image */}
                  <div
                    className="relative h-44 overflow-hidden cursor-pointer flex-shrink-0"
                    onClick={() => setSelectedMealForDetail(meal)}
                  >
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                    {/* AI Match pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md">
                      <Sparkles className="w-2.5 h-2.5" />
                      {meal.aiMatchScore}% Match
                    </div>
                    {/* Veg/NonVeg indicator */}
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${meal.isNutritionVerified ? 'border-green-500 bg-white' : 'border-red-500 bg-white'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${meal.isNutritionVerified ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                    {/* Bottom info */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <span className="text-[10px] font-semibold text-slate-200">{meal.restaurantName}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded-full">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />{meal.rating}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => setSelectedMealForDetail(meal)}
                    >
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 font-['Outfit'] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {meal.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {meal.aiExplanation}
                      </p>
                    </div>

                    {/* Macro Pills */}
                    <div className="flex items-center gap-2 mt-2.5 text-[10px] font-bold">
                      <span className="flex items-center gap-0.5 text-orange-500">
                        <Flame className="w-3 h-3" />{meal.macros.calories}kcal
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{meal.macros.protein}g protein</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-blue-600 dark:text-blue-400">GI {meal.macros.glycemicIndex}</span>
                    </div>

                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {meal.dietaryBadges.slice(0, 2).map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Price + Add Button */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400">Price</div>
                        <div className="text-base font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                          ₹{meal.price}
                        </div>
                      </div>

                      {/* Quantity Control */}
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(meal)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-emerald-600 rounded-xl overflow-hidden shadow-md shadow-emerald-600/20">
                          <button
                            onClick={() => removeFromCart(meal.id)}
                            className="p-2 text-white hover:bg-emerald-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-white font-extrabold text-sm min-w-[1rem] text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(meal)}
                            className="p-2 text-white hover:bg-emerald-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
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
            <div className="text-center py-16 space-y-3">
              <div className="text-5xl">🥗</div>
              <p className="font-bold text-slate-900 dark:text-white">No meals found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>

      {/* ── STICKY BOTTOM CART BAR ────────────────────────────────────── */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full pointer-events-auto flex items-center justify-between px-5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-extrabold">
                  {totalCartCount}
                </div>
                <span className="font-bold text-sm">View Cart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base font-['Outfit']">₹{totalCartPrice}</span>
                <ChevronRight className="w-5 h-5 opacity-80" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
