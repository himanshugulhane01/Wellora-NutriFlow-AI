import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PlatformView } from '../../types';
import { 
  Sparkles, 
  ShoppingBag, 
  Sun, 
  Moon, 
  MapPin, 
  Activity, 
  ChevronDown,
  LayoutDashboard,
  UserCheck,
  Stethoscope,
  UtensilsCrossed,
  Bot,
  Calendar,
  Store,
  Compass
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    isDarkMode, 
    setIsDarkMode,
    cart,
    setIsCartOpen,
    setIsAIModalOpen,
    setIsProfileModalOpen,
    setIsOrderTrackingOpen,
    activeOrder,
    healthProfile
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const viewLabels: Record<PlatformView, { label: string; icon: React.ElementType }> = {
    'landing': { label: 'Landing Page', icon: Compass },
    'marketplace': { label: 'Customer Marketplace', icon: UtensilsCrossed },
    'nutrition-dashboard': { label: 'Nutrition Analytics', icon: Activity },
    'meal-planner': { label: 'AI Meal Planner', icon: Calendar },
    'smart-grocery': { label: 'Smart Grocery', icon: Store },
    'doctor-consultation': { label: 'Doctor Telehealth', icon: Stethoscope },
    'admin-dashboard': { label: 'Admin Dashboard', icon: LayoutDashboard },
    'restaurant-dashboard': { label: 'Restaurant Hub', icon: UtensilsCrossed },
    'doctor-dashboard': { label: 'Doctor Portal', icon: UserCheck },
  };

  const handleSelectView = (view: PlatformView) => {
    setCurrentView(view);
    setIsRoleDropdownOpen(false);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full glass-navbar transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Slogan */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                  NUTRIFLOW
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">
                Personalized Healthcare & Food
              </p>
            </div>
          </button>

          {/* Location Chip */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold">Tech District, Block 4B</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Center: Ecosystem Role & View Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm hover:border-emerald-500/50 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 font-normal">View Mode:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {viewLabels[currentView]?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Ecosystem Platforms
              </div>
              {(Object.keys(viewLabels) as PlatformView[]).map((vKey) => {
                const IconComponent = viewLabels[vKey].icon;
                const isActive = currentView === vKey;
                return (
                  <button
                    key={vKey}
                    onClick={() => handleSelectView(vKey)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{viewLabels[vKey].label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-3">
          
          {/* AI Health Match Indicator */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent border border-emerald-500/30 hover:border-emerald-500 transition-all text-xs font-bold text-emerald-700 dark:text-emerald-400"
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Health Score:</span>
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
              {healthProfile.healthScore}
            </span>
          </button>

          {/* NutriBot Chat Launcher */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 hover:opacity-95 hover:scale-105 transition-all"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">Ask NutriBot</span>
          </button>

          {/* Active Order Tracker Chip */}
          {activeOrder && (
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="hidden sm:inline">Order #{activeOrder.id}</span>
              <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-md font-extrabold">
                {activeOrder.etaMinutes}m ETA
              </span>
            </button>
          )}

          {/* Cart Launcher */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
