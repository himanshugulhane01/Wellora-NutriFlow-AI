import React from 'react';
import { useApp } from '../../context/AppContext';
import type { PlatformView } from '../../types';
import {
  LayoutDashboard, Calendar, ShoppingBag, Activity, Bot, Store,
  Stethoscope, BarChart3, User, Settings, LogOut, Sparkles, X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const {
    currentView,
    setCurrentView,
    setIsAIModalOpen,
    setIsProfileModalOpen,
    logout,
    currentUser
  } = useApp();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' as PlatformView },
    { label: 'Meal Planner', icon: Calendar, view: 'meal-planner' as PlatformView },
    { label: 'Orders', icon: ShoppingBag, view: 'marketplace' as PlatformView },
    { label: 'Nutrition', icon: Activity, view: 'nutrition-dashboard' as PlatformView },
    { label: 'AI Coach', icon: Bot, action: () => setIsAIModalOpen(true) },
    { label: 'Grocery', icon: Store, view: 'smart-grocery' as PlatformView },
    { label: 'Doctor', icon: Stethoscope, view: 'doctor-consultation' as PlatformView },
    { label: 'Reports', icon: BarChart3, view: 'nutrition-dashboard' as PlatformView },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.action) {
      item.action();
    } else if (item.view) {
      setCurrentView(item.view);
    }
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-[#091F17] border-r border-slate-200/80 dark:border-emerald-500/10 flex flex-col justify-between p-5 flex-shrink-0 z-30">
      <div className="space-y-8">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                NutriFlow AI
              </h2>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 -mt-1">
                Clinical Health Portal
              </p>
            </div>
          </button>

          {/* Close button for mobile drawer fallback */}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-emerald-950 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Card if Logged In */}
        {currentUser && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/25 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm uppercase">
              {currentUser.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold truncate">{currentUser.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.view === currentView;
            return (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-950/20 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-emerald-500/10">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-950/20 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-950/20 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
        
        {currentUser && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
};
