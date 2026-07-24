import React from 'react';
import { useApp } from '../../context/AppContext';
import type { PlatformView } from '../../types';
import {
  LayoutDashboard, Calendar, ShoppingBag, Activity, Bot, Store,
  Stethoscope, BarChart3, User, Settings, LogOut, Sparkles, X,
  UtensilsCrossed, Users, ClipboardList, TrendingUp,
  HeartPulse, FileText, Pill, Home
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// ─── Menu Items Per Role ──────────────────────────────────────────────────────

const customerMenuItems = [
  { label: 'Dashboard', icon: Home, view: 'dashboard' as PlatformView },
  { label: 'Marketplace', icon: UtensilsCrossed, view: 'marketplace' as PlatformView },
  { label: 'Meal Planner', icon: Calendar, view: 'meal-planner' as PlatformView },
  { label: 'Nutrition', icon: Activity, view: 'nutrition-dashboard' as PlatformView },
  { label: 'AI Coach', icon: Bot, action: 'ai-modal' },
  { label: 'Smart Grocery', icon: Store, view: 'smart-grocery' as PlatformView },
  { label: 'Doctor', icon: Stethoscope, view: 'doctor-consultation' as PlatformView },
  { label: 'My Orders', icon: ShoppingBag, view: 'marketplace' as PlatformView },
];

const adminMenuItems = [
  { label: 'Admin Dashboard', icon: LayoutDashboard, view: 'admin-dashboard' as PlatformView },
  { label: 'Users', icon: Users, view: 'admin-dashboard' as PlatformView },
  { label: 'All Orders', icon: ClipboardList, view: 'admin-dashboard' as PlatformView },
  { label: 'Restaurants', icon: UtensilsCrossed, view: 'admin-dashboard' as PlatformView },
  { label: 'Analytics', icon: TrendingUp, view: 'admin-dashboard' as PlatformView },
  { label: 'Reports', icon: BarChart3, view: 'admin-dashboard' as PlatformView },
];

const restaurantMenuItems = [
  { label: 'Restaurant Hub', icon: UtensilsCrossed, view: 'restaurant-dashboard' as PlatformView },
  { label: 'My Menu', icon: ClipboardList, view: 'restaurant-dashboard' as PlatformView },
  { label: 'Live Orders', icon: ShoppingBag, view: 'restaurant-dashboard' as PlatformView },
  { label: 'Analytics', icon: TrendingUp, view: 'restaurant-dashboard' as PlatformView },
];

const doctorMenuItems = [
  { label: 'Doctor Portal', icon: HeartPulse, view: 'doctor-dashboard' as PlatformView },
  { label: 'Appointments', icon: Calendar, view: 'doctor-dashboard' as PlatformView },
  { label: 'Patient Files', icon: FileText, view: 'doctor-dashboard' as PlatformView },
  { label: 'Prescriptions', icon: Pill, view: 'doctor-dashboard' as PlatformView },
];

const getMenuItemsForRole = (role: string) => {
  switch (role) {
    case 'ADMIN': return adminMenuItems;
    case 'RESTAURANT_OWNER': return restaurantMenuItems;
    case 'DOCTOR': return doctorMenuItems;
    default: return customerMenuItems;
  }
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'ADMIN': return { label: 'Admin', color: 'bg-purple-500' };
    case 'RESTAURANT_OWNER': return { label: 'Restaurant', color: 'bg-orange-500' };
    case 'DOCTOR': return { label: 'Doctor', color: 'bg-blue-500' };
    default: return { label: 'Customer', color: 'bg-emerald-500' };
  }
};

// ─── Sidebar Component ────────────────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const {
    currentView,
    setCurrentView,
    setIsAIModalOpen,
    setIsProfileModalOpen,
    logout,
    currentUser,
  } = useApp();

  const menuItems = currentUser ? getMenuItemsForRole(currentUser.role) : customerMenuItems;
  const roleBadge = currentUser ? getRoleBadge(currentUser.role) : getRoleBadge('CUSTOMER');

  const handleItemClick = (item: { view?: PlatformView; action?: string }) => {
    if (item.action === 'ai-modal') {
      setIsAIModalOpen(true);
    } else if (item.view) {
      setCurrentView(item.view);
    }
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-[#091F17] border-r border-slate-200/80 dark:border-emerald-500/10 flex flex-col justify-between p-5 flex-shrink-0 z-30">
      <div className="space-y-6">

        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                Wellora AI
              </h2>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 -mt-0.5">
                Clinical Health Portal
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-emerald-950 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/8 to-transparent dark:from-emerald-500/15 border border-emerald-500/15 dark:border-emerald-500/25 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-black text-sm shadow-md uppercase">
              {currentUser.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold truncate">{currentUser.email}</p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-black text-white ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = 'view' in item && item.view === currentView;
            return (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-950/30 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer: Profile, Settings, Logout */}
      <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-emerald-500/10">
        <button
          onClick={() => { setIsProfileModalOpen(true); if (onClose) onClose(); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-950/20 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => { setIsProfileModalOpen(true); if (onClose) onClose(); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-950/20 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => { logout(); if (onClose) onClose(); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
