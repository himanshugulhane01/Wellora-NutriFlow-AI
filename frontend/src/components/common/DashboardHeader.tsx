import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationPopover } from './NotificationPopover';
import { LocationPickerModal } from './LocationPickerModal';
import {
  Sun, Moon, ShoppingBag, Bot, Menu, Activity,
  LogOut, MapPin, Bell
} from 'lucide-react';

interface DashboardHeaderProps {
  onMobileMenuOpen: () => void;
}

/**
 * DashboardHeader — top header bar shown on all authenticated dashboard views.
 * Displays user info, cart, AI, and settings controls.
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMobileMenuOpen }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showLocModal, setShowLocModal] = useState(false);

  const {
    currentUser,
    isDarkMode,
    setIsDarkMode,
    cart,
    setIsCartOpen,
    setIsAIModalOpen,
    openProfileModal,
    setIsOrderTrackingOpen,
    activeOrder,
    healthProfile,
    logout,
    currentView,
    userLocation,
    setUserLocation,
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Generate page title based on current view
  const pageTitles: Record<string, string> = {
    'dashboard': 'My Dashboard',
    'marketplace': 'Meal Marketplace',
    'nutrition-dashboard': 'Nutrition Analytics',
    'meal-planner': 'AI Meal Planner',
    'smart-grocery': 'Smart Grocery',
    'doctor-consultation': 'Doctor Telehealth',
    'admin-dashboard': 'Admin Dashboard',
    'restaurant-dashboard': 'Restaurant Hub',
    'doctor-dashboard': 'Doctor Portal',
    'gold-facilities': 'Gold Facilities',
    'my-orders': 'My Orders',
    'healthy-foods': 'Healthy Foods',
    'health-reports': 'Health Reports',
    'water-tracker': 'Water Tracker',
    'rewards': 'Rewards & Wallet',
    'wallet': 'Rewards & Wallet',
    'workouts': 'Workouts',
    'favorites': 'Favorites',
    'settings': 'Settings',
  };

  const pageTitle = pageTitles[currentView] || 'Wellora';

  return (
    <header
      className="sticky top-0 z-40 bg-white backdrop-blur-md border-b border-[#e4f0e8] shadow-sm"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="h-14 px-4 lg:px-6 flex items-center justify-between">

      {/* Left: Mobile Menu + Location Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl bg-green-50 text-green-600"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Location Dropdown Pill as in screenshot */}
        <button
          onClick={() => setShowLocModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4fbf6] border border-[#d6ecdd] text-xs font-semibold text-[#1a2e1f] hover:bg-green-50 hover:border-green-300 transition-all shadow-xs"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-bold text-[11px] text-[#1a2e1f]">{userLocation || 'Tech District, Block 4B'}</span>
          <span className="text-[10px] text-gray-400">⌄</span>
        </button>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2.5">

        {/* Add Health Report Pill Button */}
        <button
          onClick={() => openProfileModal('vitals')}
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#b8dfc4] hover:bg-green-50/50 hover:border-green-500 transition-all text-xs font-bold text-emerald-700 shadow-xs"
        >
          <span className="text-emerald-600 text-sm font-black leading-none">+</span>
          <span className="text-[11px] font-bold text-emerald-800">Add Health Report</span>
        </button>

        {/* AI Coach filled pill button */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#054a39] hover:bg-[#033c2e] text-white font-bold text-xs shadow-sm transition-all"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-[11px]">AI Coach</span>
        </button>

        {/* Notifications with red dot */}
        <button
          onClick={() => setIsNotificationsOpen(prev => !prev)}
          className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* Messages / Mail Icon */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Messages"
          title="Messages"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        {/* User Avatar Circle (H with green indicator dot) */}
        {currentUser && (
          <div className="flex items-center gap-1.5 pl-1">
            <button
              onClick={() => openProfileModal('account')}
              className="relative group"
              title={currentUser.name}
            >
              <div className="w-8 h-8 rounded-full bg-[#054a39] flex items-center justify-center text-white text-xs font-black shadow-sm">
                <span>{currentUser.name ? currentUser.name[0].toUpperCase() : 'H'}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
            </button>
          </div>
        )}
      </div>

      {/* Notification Popover */}
      <NotificationPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Location Picker Modal (Interactive Map & Address Form) */}
      <LocationPickerModal
        isOpen={showLocModal}
        onClose={() => setShowLocModal(false)}
        currentLocation={userLocation}
        onLocationSave={(newAddr) => setUserLocation(newAddr)}
      />
      </div>
    </header>
  );
};
