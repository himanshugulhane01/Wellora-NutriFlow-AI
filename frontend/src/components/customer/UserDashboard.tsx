import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationPopover } from '../common/NotificationPopover';
import type { Meal } from '../../types';
import {
  Sparkles,
  ChevronRight, Plus, Minus, AlertTriangle, ClipboardList,
  Search, Star, Clock, ShieldCheck, Leaf,
  Bike, SlidersHorizontal, X, ShieldAlert, Eye, EyeOff,
  ShoppingCart, Calendar, Stethoscope, UtensilsCrossed, Activity,
  Bell, UserCheck, ArrowRight
} from 'lucide-react';
import { AIFoodWarningModal, analyzeFoodRisk } from './AIFoodWarningModal';
import type { FoodRiskWarning } from './AIFoodWarningModal';

// ─── Food Category Chips ───────────────────────────────────────────────────────
interface FoodCategory {
  id: string;
  label: string;
  emoji: string;
  filterKeywords: string[];
}

const FOOD_CATEGORIES: FoodCategory[] = [
  { id: 'all',       label: 'All Foods',       emoji: '🌟', filterKeywords: [] },
  { id: 'healthy',   label: 'Healthy Bowls',   emoji: '🥗', filterKeywords: ['healthy', 'salad', 'bowl', 'pcos', 'diabetic', 'low gi', 'keto', 'vegan'] },
  { id: 'protein',   label: 'High Protein',    emoji: '💪', filterKeywords: ['protein', 'paneer', 'egg', 'chicken', 'salmon', 'tofu'] },
  { id: 'pizza',     label: 'Pizza',           emoji: '🍕', filterKeywords: ['pizza', 'italian', 'flatbread'] },
  { id: 'burger',    label: 'Burgers & Wraps', emoji: '🍔', filterKeywords: ['burger', 'sandwich', 'wrap', 'falafel'] },
  { id: 'biryani',   label: 'Biryani & Rice',  emoji: '🍛', filterKeywords: ['biryani', 'rice', 'pilaf', 'pulao', 'thali'] },
  { id: 'chinese',   label: 'Chinese',         emoji: '🥡', filterKeywords: ['noodles', 'chinese', 'stir fry', 'fried rice', 'dumpling', 'momos'] },
  { id: 'soup',      label: 'Soups',           emoji: '🍲', filterKeywords: ['soup', 'stew', 'broth', 'lentil'] },
  { id: 'breakfast', label: 'Breakfast',       emoji: '🌅', filterKeywords: ['breakfast', 'oats', 'smoothie', 'toast', 'scramble', 'pancake'] },
  { id: 'keto',      label: 'Keto & Low Carb', emoji: '🥑', filterKeywords: ['keto', 'low carb', 'cauliflower', 'avocado', 'fat bomb'] },
  { id: 'drinks',    label: 'Juices & Shakes', emoji: '🥤', filterKeywords: ['juice', 'smoothie', 'shake', 'drink', 'milk', 'lassi'] },
  { id: 'snacks',    label: 'Snacks',          emoji: '🍘', filterKeywords: ['snack', 'energy ball', 'chia', 'pudding', 'bar'] },
  { id: 'dessert',   label: 'Desserts',        emoji: '🍰', filterKeywords: ['cake', 'dessert', 'sweet', 'ice cream', 'kheer', 'gulab'] },
];

// Food App Offer Banners
const FOOD_OFFERS = [
  { id: '1', title: '50% OFF NutriBowls', desc: 'Code: NUTRI50 · On all freshly prepared wholesome meals', bg: 'from-[#034B36] to-emerald-800', tag: 'OFFER OF THE DAY', filterCategory: 'healthy' },
  { id: '2', title: 'Guilt-Free Gourmet Pizzas', desc: 'Made with organic almond & cauliflower crust', bg: 'from-amber-600 to-orange-700', tag: 'CHEF SPECIAL', filterCategory: 'pizza' },
  { id: '3', title: '15-Min Express Delivery', desc: 'Hot & fresh from certified partner kitchens near you', bg: 'from-blue-700 to-indigo-900', tag: 'SUPERFAST', sortBy: 'prep-time' as SortOption },
];

type SortOption = 'ai-match' | 'rating' | 'price-low' | 'price-high' | 'prep-time';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'ai-match',    label: 'AI Recommendation Match' },
  { value: 'rating',      label: 'Top Rated Dishes' },
  { value: 'price-low',   label: 'Price: Low to High' },
  { value: 'price-high',  label: 'Price: High to Low' },
  { value: 'prep-time',   label: 'Fastest Delivery' },
];

// ─── Meal Card Component ──────────────────────────────────────────────────────
interface MealCardProps {
  meal: Meal;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onDetail: () => void;
  healthRisk: FoodRiskWarning | null;
}

const MealCard: React.FC<MealCardProps> = ({ meal, qty, onAdd, onRemove, onDetail, healthRisk }) => {
  const isRisky = !!healthRisk;
  const isBlock = healthRisk?.level === 'block';

  return (
    <div className={`group bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
      isBlock ? 'border-red-500/50 ring-1 ring-red-500/20' : isRisky ? 'border-orange-400/50 ring-1 ring-orange-400/20' : 'border-[#e4f0e8]'
    }`}>
      <div>
        {/* Image & Badges */}
        <div className="relative h-48 sm:h-52 overflow-hidden cursor-pointer" onClick={onDetail}>
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {meal.isNutritionVerified && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-black text-emerald-800 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Kitchen Verified
              </span>
            )}
            {meal.aiMatchScore >= 90 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-[10px] font-black text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> {meal.aiMatchScore}% Match
              </span>
            )}
          </div>

          {/* Top Right Unhealthy Warning Badge */}
          {isRisky && (
            <div className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-md text-[10px] font-black shadow-xl animate-pulse
              ${isBlock ? 'bg-red-600 text-white border border-white/30' : 'bg-orange-500 text-white border border-white/30'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isBlock ? 'UNHEALTHY FOR YOU' : 'HEALTH CAUTION'}</span>
            </div>
          )}

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <p className="font-extrabold text-xs text-emerald-300 drop-shadow">{meal.restaurantName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center gap-1 bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black">
                  <Star className="w-3 h-3 fill-slate-950" /> {meal.rating}
                </div>
                <span className="text-[10px] text-slate-200">({meal.reviewCount}+ orders)</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/10">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{meal.prepTime}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Name & Veg Tag */}
          <div className="flex items-start gap-2">
            <div className={`mt-1 w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${
              meal.isVeg !== false ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${meal.isVeg !== false ? 'bg-emerald-600' : 'bg-red-600'}`} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug cursor-pointer hover:text-emerald-600 transition-colors" onClick={onDetail}>
              {meal.name}
            </h3>
          </div>

          {/* HEALTH WARNING NOTIFICATION STRIP ON CARD */}
          {isRisky && (
            <div className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-start gap-2 ${
              isBlock ? 'bg-red-500/10 border-red-500/25 text-red-700' : 'bg-orange-500/10 border-orange-500/25 text-orange-700'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-black block uppercase tracking-wider text-[9px]">{healthRisk.reason}</span>
                <span className="text-[10px] leading-tight font-semibold block mt-0.5">{healthRisk.detail.slice(0, 85)}...</span>
              </div>
            </div>
          )}

          {/* Macros Bar */}
          <div className="grid grid-cols-3 gap-2 bg-[#f7fdf9] p-2 rounded-xl text-center text-[10px] border border-[#e4f0e8]">
            <div>
              <span className="text-gray-400 font-semibold block">Calories</span>
              <span className="font-black text-slate-800">{meal.macros.calories} kcal</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block">Protein</span>
              <span className="font-black text-purple-600">{meal.macros.protein}g</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block">Glycemic Index</span>
              <span className="font-black text-emerald-600">{meal.macros.glycemicIndex || 'GI 32'}</span>
            </div>
          </div>

          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1">
            {meal.dietaryBadges.slice(0, 3).map(b => (
              <span key={b} className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
        <div>
          <span className="text-xl font-black text-slate-900">₹{meal.price}</span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5">
            <Bike className="w-3 h-3" />
            <span>Free Delivery</span>
          </div>
        </div>

        {qty === 0 ? (
          <button
            onClick={onAdd}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all hover:scale-105 shadow-md ${
              isBlock
                ? 'bg-red-500/10 border border-red-500/30 text-red-600 hover:bg-red-500/20'
                : isRisky
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
            }`}
          >
            {isRisky && <AlertTriangle className="w-3.5 h-3.5" />}
            <Plus className="w-4 h-4" />
            <span>{isBlock ? 'Warning' : 'ADD'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-green-500 text-white rounded-2xl p-1 shadow-md">
            <button onClick={onRemove} className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-black px-1">{qty}</span>
            <button onClick={onAdd} className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Unified Home / Order Food Component ──────────────────────────────────────
export const UserDashboard: React.FC = () => {
  const {
    healthProfile,
    addToCart,
    removeFromCart,
    cart,
    setIsCartOpen,
    setSelectedMealForDetail,
    addGroceryToCart,
    setCurrentView,
    currentUser,
    openProfileModal,
    meals,
    isLoadingMeals,
    searchQuery,
    setSearchQuery,
    ordersHistory,
  } = useApp();

  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('ai-match');
  const [vegOnly, setVegOnly] = useState(false);
  const [hideUnhealthy, setHideUnhealthy] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Warning modal & toast state
  const [pendingMeal, setPendingMeal] = useState<Meal | null>(null);
  const [activeWarning, setActiveWarning] = useState<FoodRiskWarning | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getCartQty = (mealId: string) => cart.find(i => i.meal.id === mealId)?.quantity || 0;
  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const totalCartPrice = cart.reduce((s, i) => s + i.meal.price * i.quantity, 0);

  // Active Category object
  const activeCategory = FOOD_CATEGORIES.find(c => c.id === activeCategoryId) || FOOD_CATEGORIES[0];

  const hasHealthProfile = !!(
    healthProfile.age && healthProfile.age > 0 &&
    healthProfile.heightCm > 0 &&
    healthProfile.weightKg > 0
  );
  const isNewUser = !hasHealthProfile && ordersHistory.length === 0;

  // Compute risks for all meals based on user's health profile, vitals, allergies & diet
  const mealRisks = useMemo(() => {
    const map = new Map<string, FoodRiskWarning | null>();
    meals.forEach(meal => {
      map.set(meal.id, analyzeFoodRisk(
        meal,
        healthProfile.diseases,
        {
          bloodPressureSystolic:  healthProfile.bloodPressureSystolic,
          bloodPressureDiastolic: healthProfile.bloodPressureDiastolic,
          bloodSugarFasting:      healthProfile.bloodSugarFasting,
          cholesterolTotal:       healthProfile.cholesterolTotal,
          heartRateBpm:           healthProfile.heartRateBpm,
        },
        healthProfile.allergies,
        healthProfile.dietaryPreference || currentUser?.dietaryPreference
      ));
    });
    return map;
  }, [meals, healthProfile, currentUser]);

  // Filtered & Sorted meals
  const filteredAndSorted = useMemo(() => {
    let result = [...meals];

    // Category filter
    if (activeCategory.filterKeywords.length > 0) {
      result = result.filter(meal => {
        const haystack = `${meal.name} ${meal.restaurantName} ${meal.dietaryBadges.join(' ')} ${meal.categories.join(' ')} ${meal.aiExplanation}`.toLowerCase();
        return activeCategory.filterKeywords.some(kw => haystack.includes(kw));
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(meal =>
        meal.name.toLowerCase().includes(q) ||
        meal.restaurantName.toLowerCase().includes(q) ||
        meal.dietaryBadges.some(b => b.toLowerCase().includes(q)) ||
        meal.categories.some(c => c.toLowerCase().includes(q)) ||
        meal.ingredients.some(i => i.toLowerCase().includes(q)) ||
        meal.aiExplanation.toLowerCase().includes(q)
      );
    }

    // Veg filter
    if (vegOnly) {
      result = result.filter(meal => meal.isVeg !== false);
    }

    // Hide Unhealthy filter
    if (hideUnhealthy) {
      result = result.filter(meal => !mealRisks.get(meal.id));
    }

    // Sort
    switch (sortBy) {
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
      case 'price-low':  result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'prep-time':  result.sort((a, b) => parseInt(a.prepTime) - parseInt(b.prepTime)); break;
      default:           result.sort((a, b) => b.aiMatchScore - a.aiMatchScore); break;
    }

    return result;
  }, [meals, activeCategoryId, searchQuery, vegOnly, hideUnhealthy, sortBy, mealRisks]);

  // Healthy alternatives for warning modal
  const getAlternatives = (blockedMeal: Meal): Meal[] =>
    meals
      .filter(m => m.id !== blockedMeal.id && !mealRisks.get(m.id))
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
      .slice(0, 3);

  // Handle Add to Cart with Health Warning Guard
  const handleAddToCart = (meal: Meal) => {
    const risk = mealRisks.get(meal.id);
    if (risk) {
      setPendingMeal(meal);
      setActiveWarning(risk);
      setToastMessage(`⚠️ HEALTH NOTIFICATION: ${meal.name} is flagged for ${risk.reason}`);
      setTimeout(() => setToastMessage(null), 5000);
    } else {
      addToCart(meal);
    }
  };

  const handleWarningProceed = () => {
    if (pendingMeal) addToCart(pendingMeal);
    setPendingMeal(null);
    setActiveWarning(null);
  };

  const handleWarningCancel = () => {
    setPendingMeal(null);
    setActiveWarning(null);
  };

  const handleSelectAlternative = (meal: Meal) => {
    setPendingMeal(null);
    setActiveWarning(null);
    addToCart(meal);
  };

  const handleOfferClick = (offer: typeof FOOD_OFFERS[number]) => {
    if (offer.filterCategory) {
      setActiveCategoryId(offer.filterCategory);
    }
    if (offer.sortBy) {
      setSortBy(offer.sortBy);
      setShowFilters(true);
    }
    setTimeout(() => {
      document.getElementById('food-menu-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleOrderGrocery = (item: { id: string; name: string; price: number; image: string; tag: string }) => {
    addGroceryToCart({
      id: item.id, name: item.name, price: item.price, image: item.image,
      unit: '1 pack', rating: 4.8, isOrganic: true, nutritionTag: item.tag, category: 'Protein'
    });
  };

  const quickLinks = [
    { label: 'Healthy Foods', icon: Leaf, view: 'healthy-foods' as const, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { label: 'Smart Grocery', icon: ShoppingCart, view: 'smart-grocery' as const, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { label: 'Meal Plan', icon: Calendar, view: 'meal-planner' as const, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { label: 'Daily Report', icon: ClipboardList, view: 'health-reports' as const, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  ];

  const totalRiskyCount = Array.from(mealRisks.values()).filter(Boolean).length;
  const userHasHealthDetails = !!(healthProfile.bloodPressureSystolic || healthProfile.bloodSugarFasting || healthProfile.diseases.length > 0);

  return (
    <div className="min-h-screen text-[#1a2e1f] pb-24 font-sans" style={{ background: 'var(--bg-app)' }}>

      {/* ── TOP REAL-TIME HEALTH NOTIFICATION TOAST BANNER ── */}
      {toastMessage && (
        <div className="sticky top-16 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 pt-5">

        {/* ── 1. GREETING BANNER WITH SALAD GRAPHIC & CALL TO ACTION ── */}
        <div
          className="rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(108deg, #eaf6ee 0%, #eef8f1 55%, #f4fbf6 100%)',
            border: '1px solid #d6ecdd'
          }}
        >
          {/* Left Content */}
          <div className="flex items-start gap-4 z-10 max-w-xl">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-[#d6ecdd]">
              <Leaf className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#102a1c] tracking-tight">
                Good Evening, {currentUser?.name?.split(' ')[0] || 'Himanshu'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                Order wholesome, chef-crafted meals delivered hot to your doorstep.
              </p>
              <p className="text-[11.5px] text-gray-500 font-medium pt-0.5">
                You currently have <strong className="text-gray-700">0 orders</strong> and <strong className="text-gray-700">₹0 spent</strong>. Explore our healthy mess and restaurant menu below.
              </p>
            </div>
          </div>

          {/* Right Action & Visual Graphics */}
          <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-end">
            {/* Salad bowl image with decorative overlay */}
            <div className="relative hidden lg:block shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80"
                  alt="Healthy Bowl"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Set Preferences and Bell buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openProfileModal('vitals')}
                className="px-5 py-2.5 rounded-full bg-[#054a39] hover:bg-[#033c2e] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <span>Set Preferences</span>
                <span className="text-sm font-normal">→</span>
              </button>

              <button
                onClick={() => setShowNotificationsPopover(true)}
                className="w-9 h-9 rounded-full bg-white border border-[#d6ecdd] text-gray-600 hover:text-emerald-700 flex items-center justify-center transition-all shadow-xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Handwritten style badge: "Better Food Healthier You" */}
            <div className="hidden xl:block pl-2 text-right pointer-events-none select-none">
              <span className="font-serif italic font-bold text-xs tracking-tight text-emerald-800 leading-tight block">
                Better<br/>Food<br/><span className="text-emerald-600">Healthier</span><br/>You
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. SEARCH BAR & FILTERS (Screenshot Style) ── */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Main search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes, homemade mess, healthy bowls, biryani, pizza..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#f7faf8] border border-[#e2ece5] text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Pure Veg Pill with Dropdown indicator */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
              vegOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white border-[#d8e6dd] text-gray-700 hover:bg-emerald-50/50'
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-white' : 'text-emerald-600'}`} />
            <span>Pure Veg</span>
            <span className="text-[10px] text-gray-400 font-normal">⌄</span>
          </button>

          {/* Filter Icon Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all shrink-0 ${
              showFilters ? 'bg-[#054a39] text-white border-[#054a39]' : 'bg-white border-[#d8e6dd] text-gray-600 hover:bg-emerald-50/50'
            }`}
            title="Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* ── 3. CATEGORY CHIPS BAR WITH SCROLL ARROW ── */}
        <div className="relative flex items-center">
          <div
            id="category-chips-container"
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth w-full pr-10"
          >
            {FOOD_CATEGORIES.map(cat => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#054a39] text-white shadow-xs'
                      : 'bg-[#f4f8f5] border border-[#e0ece3] text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/40'
                  }`}
                >
                  <span className="text-xs">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Arrow button */}
          <button
            onClick={() => {
              document.getElementById('category-chips-container')?.scrollBy({ left: 160, behavior: 'smooth' });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-[#d6ecdd] shadow-sm flex items-center justify-center text-gray-600 hover:text-emerald-700 transition-all z-10"
            title="Next categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── 4. PROMO / OFFER CARDS (NutriBowls, Pizza, Express Delivery) ── */}
        {activeCategoryId === 'all' && !searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: 50% OFF NutriBowls */}
            <div
              onClick={() => handleOfferClick(FOOD_OFFERS[0])}
              className="p-5 rounded-3xl relative overflow-hidden text-white flex flex-col justify-between min-h-[160px] cursor-pointer shadow-sm hover:shadow-md transition-all group"
              style={{
                background: 'linear-gradient(135deg, #186641 0%, #2f8e5b 100%)'
              }}
            >
              <div className="z-10 max-w-[62%]">
                <span className="px-2 py-0.5 rounded-full bg-black/20 text-[8.5px] font-black uppercase tracking-wider text-emerald-200">
                  OFFER OF THE DAY
                </span>
                <h4 className="text-lg font-black mt-1 leading-tight text-white">50% OFF NutriBowls</h4>
                <p className="text-[10px] text-emerald-100 mt-1 font-medium leading-snug">
                  Code: NUTRI50 · On all freshly prepared wholesome meals
                </p>
              </div>

              <div className="z-10 mt-3">
                <button className="px-3.5 py-1.5 rounded-full bg-white text-[#186641] text-xs font-black shadow-xs flex items-center gap-1 group-hover:scale-105 transition-all">
                  Order Now →
                </button>
              </div>

              {/* Dish bowl graphic on right */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full overflow-hidden border-2 border-white/40 shadow-xl pointer-events-none group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=80"
                  alt="NutriBowls"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 2: Guilt-Free Gourmet Pizzas */}
            <div
              onClick={() => handleOfferClick(FOOD_OFFERS[1])}
              className="p-5 rounded-3xl relative overflow-hidden text-white flex flex-col justify-between min-h-[160px] cursor-pointer shadow-sm hover:shadow-md transition-all group"
              style={{
                background: 'linear-gradient(135deg, #d37326 0%, #eb943f 100%)'
              }}
            >
              <div className="z-10 max-w-[62%]">
                <span className="px-2 py-0.5 rounded-full bg-black/20 text-[8.5px] font-black uppercase tracking-wider text-amber-100">
                  CHEF SPECIAL
                </span>
                <h4 className="text-lg font-black mt-1 leading-tight text-white">Guilt-Free Gourmet Pizzas</h4>
                <p className="text-[10px] text-amber-100 mt-1 font-medium leading-snug">
                  Made with organic almond & cauliflower crust
                </p>
              </div>

              <div className="z-10 mt-3">
                <button className="px-3.5 py-1.5 rounded-full bg-white text-[#c7651a] text-xs font-black shadow-xs flex items-center gap-1 group-hover:scale-105 transition-all">
                  Order Now →
                </button>
              </div>

              {/* Pizza Graphic */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full overflow-hidden border-2 border-white/40 shadow-xl pointer-events-none group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80"
                  alt="Healthy Pizza"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 3: 15-Min Express Delivery */}
            <div
              onClick={() => handleOfferClick(FOOD_OFFERS[2])}
              className="p-5 rounded-3xl relative overflow-hidden text-white flex flex-col justify-between min-h-[160px] cursor-pointer shadow-sm hover:shadow-md transition-all group"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
              }}
            >
              <div className="z-10 max-w-[62%]">
                <span className="px-2 py-0.5 rounded-full bg-black/20 text-[8.5px] font-black uppercase tracking-wider text-blue-100">
                  SUPERFAST
                </span>
                <h4 className="text-lg font-black mt-1 leading-tight text-white">15-Min Express Delivery</h4>
                <p className="text-[10px] text-blue-100 mt-1 font-medium leading-snug">
                  Hot & fresh from certified partner kitchens near you
                </p>
              </div>

              <div className="z-10 mt-3">
                <button className="px-3.5 py-1.5 rounded-full bg-white text-[#1d4ed8] text-xs font-black shadow-xs flex items-center gap-1 group-hover:scale-105 transition-all">
                  Order Now →
                </button>
              </div>

              {/* Express Meal container Graphic */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full overflow-hidden border-2 border-white/40 shadow-xl pointer-events-none group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?w=300&auto=format&fit=crop&q=80"
                  alt="Express Healthy Food"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── 5. EXPLORE SERVICES (4 Clean horizontal cards with arrows) ── */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
            EXPLORE SERVICES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Healthy Foods */}
            <div
              onClick={() => setCurrentView('healthy-foods')}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e0ece3] shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ecf7f0] flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#102a1c]">Healthy Foods</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-gray-400 transition-all shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2: Smart Grocery */}
            <div
              onClick={() => setCurrentView('smart-grocery')}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e0ece3] shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5effe] flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#102a1c]">Smart Grocery</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-all shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 3: Meal Plan */}
            <div
              onClick={() => setCurrentView('meal-planner')}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e0ece3] shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ecf7f0] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#102a1c]">Meal Plan</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-gray-400 transition-all shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 4: Daily Report */}
            <div
              onClick={() => setCurrentView('health-reports')}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e0ece3] shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaf7f7] flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#102a1c]">Daily Report</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-all shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. SMART GROCERY STRIP ── */}
        <div className="bg-white rounded-3xl p-5 border border-[#e0ece3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#102a1c]">Fresh Kitchen Essentials & Groceries</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Fresh ingredients · Organic · Better choices</p>
              </div>
            </div>
            <button onClick={() => setCurrentView('smart-grocery')} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
              <span>Shop All</span>
              <span className="text-sm font-normal">→</span>
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              { id: 'g1', name: 'Eggs (6 pcs)',   price: 90,  tag: 'High Protein', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=150' },
              { id: 'g2', name: 'Fresh Spinach',  price: 40,  tag: 'Iron Rich',    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=150' },
              { id: 'g3', name: 'Lean Chicken',   price: 240, tag: 'Lean Protein',  image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150' },
              { id: 'g4', name: 'Rolled Oats',    price: 180, tag: 'High Fiber',    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=150' },
              { id: 'g5', name: 'Raw Almonds',    price: 220, tag: 'Healthy Fats',  image: 'https://images.unsplash.com/photo-1508061252227-14902b0b2975?w=150' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleOrderGrocery(item)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#f7fdf9] border border-[#e4f0e8] hover:border-green-300 hover:bg-green-50 transition-all min-w-[84px] text-center shrink-0"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#e4f0e8]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-gray-700">{item.name}</span>
                <span className="text-[10px] font-black text-green-600">₹{item.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 7. HEALTH GUARD ACTIVE NOTIFICATION (Food Safety Protection) ── */}
        {userHasHealthDetails && totalRiskyCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  AI Order Safety Active • {healthProfile.diseases.join(', ') || 'Custom Health Profile'}
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Wellora automatically warns you if any dish conflicts with your blood pressure or health limits. Look for ⚠️ badges.
                </p>
              </div>
            </div>

            <button
              onClick={() => setHideUnhealthy(!hideUnhealthy)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                hideUnhealthy ? 'bg-green-600 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {hideUnhealthy ? 'Show All Foods' : 'Hide Unhealthy Foods (1-Click)'}
            </button>
          </div>
        )}

        {/* ── 8. MAIN FOOD MARKETPLACE GRID ── */}
        <div id="food-menu-section" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e4f0e8] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#1a2e1f]">
                {activeCategory.emoji} {activeCategory.label}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {filteredAndSorted.length} meals available · Delivered hot & fresh
              </p>
            </div>
            {activeCategoryId !== 'all' && (
              <button
                onClick={() => setActiveCategoryId('all')}
                className="text-xs font-bold text-green-600 hover:underline"
              >
                View All Categories
              </button>
            )}
          </div>

          {isLoadingMeals ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-[#e4f0e8] h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#e4f0e8] p-8 space-y-3">
              <div className="text-4xl">🥗</div>
              <h3 className="text-base font-bold text-gray-800">No dishes found</h3>
              <p className="text-xs text-gray-400">Try clearing filters or switching food categories.</p>
              <button
                onClick={() => { setActiveCategoryId('all'); setSearchQuery(''); setHideUnhealthy(false); }}
                className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSorted.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  qty={getCartQty(meal.id)}
                  onAdd={() => handleAddToCart(meal)}
                  onRemove={() => removeFromCart(meal.id)}
                  onDetail={() => setSelectedMealForDetail(meal)}
                  healthRisk={mealRisks.get(meal.id) ?? null}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── STICKY CART BAR ── */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 z-40">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white shadow-xl hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                  {totalCartCount}
                </span>
                <span className="font-bold text-sm">
                  {totalCartCount} item{totalCartCount > 1 ? 's' : ''} in cart
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-base">₹{totalCartPrice}</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-bold uppercase tracking-wider">
                  View Cart →
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── AI FOOD WARNING MODAL (Warns if user orders unhealthy/high BP dish) ── */}
      {activeWarning && pendingMeal && (
        <AIFoodWarningModal
          warning={activeWarning}
          meal={pendingMeal}
          alternatives={getAlternatives(pendingMeal)}
          onProceed={handleWarningProceed}
          onCancel={handleWarningCancel}
          onSelectAlternative={handleSelectAlternative}
        />
      )}

      {/* ── NOTIFICATION POPOVER ── */}
      <NotificationPopover
        isOpen={showNotificationsPopover}
        onClose={() => setShowNotificationsPopover(false)}
      />
    </div>
  );
};

export default UserDashboard;
