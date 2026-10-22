import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { PlatformView } from '../../types';
import {
  LayoutDashboard, Calendar, ShoppingBag, Activity,
  Stethoscope, UtensilsCrossed, Settings, FileText,
  Droplet, Heart, Award, Leaf, Gift, X, Apple,
  ChevronDown, ChevronRight, HeartPulse, ShoppingCart,
  User, ClipboardList, Utensils, Home, Store
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type MenuItem = {
  label: string;
  icon: React.ElementType;
  view: PlatformView;
  badge?: string;
};

type MenuSection = {
  id: string;
  label: string;
  color: string;        // accent colour class
  bgColor: string;      // light bg colour class
  icon: React.ElementType;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    id: 'food',
    label: 'Food & Order',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: Utensils,
    items: [
      { label: 'Order Food',        icon: UtensilsCrossed, view: 'dashboard' },
      { label: 'Healthy Foods',     icon: Apple,           view: 'healthy-foods' },
      { label: 'Smart Grocery',     icon: ShoppingCart,    view: 'smart-grocery' },
      { label: 'Meal Planner',      icon: Calendar,        view: 'meal-planner' },
    ],
  },
  {
    id: 'health',
    label: 'My Health',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: HeartPulse,
    items: [
      { label: 'Daily Health Report', icon: ClipboardList, view: 'health-reports', badge: 'Today' },
    ],
  },
  {
    id: 'account',
    label: 'My Account',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    icon: User,
    items: [
      { label: 'My Orders',        icon: ShoppingBag, view: 'my-orders' },
      { label: 'Rewards & Wallet', icon: Award,       view: 'rewards' },
      { label: 'Settings',         icon: Settings,    view: 'settings' },
    ],
  },
];

const getSectionForView = (view: PlatformView): string | null => {
  for (const section of menuSections) {
    if (section.items.some(i => i.view === view)) return section.id;
  }
  return null;
};

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { currentView, setCurrentView, currentUser } = useApp();

  const handleItemClick = (view: PlatformView) => {
    setCurrentView(view);
    if (onClose) onClose();
  };

  return (
    <aside className="w-56 h-screen sticky top-0 bg-white border-r border-[#e8f1eb] flex flex-col flex-shrink-0 z-30 font-sans">

      {/* ── Brand Header ── */}
      <div className="p-4 pt-5 pb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-[#0a2e1d] font-['Outfit'] leading-none flex items-center gap-1">
              Wellora <span className="text-[#10b981] font-black text-xs">AI</span>
            </h2>
            <p className="text-[8.5px] font-medium text-gray-400 mt-0.5 tracking-tight">
              Personalized Healthcare & Food
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto scrollbar-none">

        {/* Food & Order Group */}
        <div>
          <div className="px-3 pb-1.5 text-[10.5px] font-bold text-gray-400 tracking-normal">
            Food & Order
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => handleItemClick('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#ecf7f0] text-[#0f5132] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Utensils className={`w-4 h-4 ${currentView === 'dashboard' ? 'text-[#0f5132]' : 'text-gray-500'}`} />
                <span>Order Food</span>
              </div>
              {currentView === 'dashboard' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>

            <button
              onClick={() => handleItemClick('healthy-foods')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'healthy-foods'
                  ? 'bg-[#ecf7f0] text-[#0f5132] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Leaf className={`w-4 h-4 ${currentView === 'healthy-foods' ? 'text-[#0f5132]' : 'text-gray-500'}`} />
                <span>Healthy Foods</span>
              </div>
              {currentView === 'healthy-foods' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>

            <button
              onClick={() => handleItemClick('smart-grocery')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'smart-grocery'
                  ? 'text-[#0f5132] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 text-gray-500" />
                <span>Smart Grocery</span>
              </div>
              {currentView === 'smart-grocery' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>

            <button
              onClick={() => handleItemClick('meal-planner')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'meal-planner'
                  ? 'text-[#0f5132] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Meal Planner</span>
              </div>
              {currentView === 'meal-planner' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Health & Wellness Group */}
        <div>
          <div className="px-3 pb-1.5 text-[10.5px] font-bold text-gray-400 tracking-normal">
            Health & Wellness
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => handleItemClick('health-reports')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'health-reports'
                  ? 'text-[#0f5132] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-gray-500" />
                <span>My Health</span>
              </div>
              {currentView === 'health-reports' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>

            <button
              onClick={() => handleItemClick('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'settings'
                  ? 'text-[#0f5132] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-gray-500" />
                <span>My Account</span>
              </div>
              {currentView === 'settings' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>

            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => handleItemClick('admin-portal')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all mt-1"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🛡️</span>
                  <span>Admin Console</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 uppercase font-black">
                  Staff
                </span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── Bottom: Wellora Gold Card ── */}
      <div className="p-3 shrink-0">
        <div className="p-3.5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#f1faf3] to-[#e6f7ec] border border-[#d6ecdd]">
          {/* Subtle leaves decoration in bottom right */}
          <div className="absolute -bottom-2 -right-2 opacity-35 pointer-events-none">
            <Leaf className="w-14 h-14 text-emerald-400" />
          </div>

          <div className="flex items-center gap-1.5 mb-1 text-[#b58105]">
            <span className="text-xs">👑</span>
            <span className="text-xs font-bold text-[#1a2e1f]">Wellora Gold</span>
          </div>
          <p className="text-[9.5px] text-gray-500 font-medium leading-snug mb-3 max-w-[140px]">
            Unlock AI health coaching, unlimited meal plans & priority doctor access.
          </p>
          <button
            id="sidebar-upgrade-btn"
            onClick={() => handleItemClick('gold-facilities')}
            className="w-full py-1.5 px-3 rounded-lg bg-[#054a39] hover:bg-[#033c2e] text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-xs"
          >
            Upgrade →
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
