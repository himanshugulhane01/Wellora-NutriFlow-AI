import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Sidebar } from './components/common/Sidebar';
import { HeroSection } from './components/landing/HeroSection';
import { HowItWorks } from './components/landing/HowItWorks';
import { CategoryGrid } from './components/landing/CategoryGrid';
import { FeatureSection } from './components/landing/FeatureSection';
import { PricingSection } from './components/landing/PricingSection';
import { Marketplace } from './components/customer/Marketplace';
import { NutritionDashboard } from './components/customer/NutritionDashboard';
import { MealPlanner } from './components/customer/MealPlanner';
import { SmartGroceryStore } from './components/customer/SmartGroceryStore';
import { DoctorConsultation } from './components/customer/DoctorConsultation';
import { MealDetailModal } from './components/customer/MealDetailModal';
import { AIAssistantModal } from './components/customer/AIAssistantModal';
import { HealthProfileModal } from './components/customer/HealthProfileModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { RestaurantDashboard } from './components/dashboards/RestaurantDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { AuthModal } from './components/customer/AuthModal';
import { UserDashboard } from './components/customer/UserDashboard';
import { 
  LayoutDashboard, Compass, Bot, ShoppingBag, User, Menu 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    setIsAIModalOpen, 
    setIsProfileModalOpen,
    setIsCartOpen 
  } = useApp();
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If view is landing, render clean full-width hero layout
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F4F7F5] dark:bg-[#07130F]">
        <div>
          <Navbar />
          <main>
            <HeroSection />
            <HowItWorks />
            <CategoryGrid />
            <FeatureSection />
            <PricingSection />
          </main>
        </div>
        <Footer />

        {/* Global Drawers & Overlay Modals */}
        <MealDetailModal />
        <AIAssistantModal />
        <HealthProfileModal />
        <CartDrawer />
        <OrderTrackingModal />
        <AuthModal />
      </div>
    );
  }

  // Dashboard/Marketplace inside responsive app container (Sidebar on left, content on right)
  return (
    <div className="min-h-screen flex bg-[#F4F7F5] dark:bg-[#07130F]">
      
      {/* Desktop Sidebar (Left Panel) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar fallback */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Right side wrapper containing Mobile header + Main Content + Mobile Bottom bar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 lg:pb-0">
        
        {/* Mobile Header (Only visible on small screens to toggle menu / location) */}
        <header className="lg:hidden h-16 bg-white dark:bg-[#091F17] border-b border-slate-200/80 dark:border-emerald-500/10 px-4 flex items-center justify-between sticky top-0 z-40">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-950/40 text-slate-700 dark:text-emerald-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <span className="font-extrabold text-sm text-slate-900 dark:text-white font-['Outfit']">NutriFlow AI</span>
          
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center"
          >
            P
          </button>
        </header>

        {/* Dynamic Main view */}
        <main className="flex-1">
          {currentView === 'dashboard' && <UserDashboard />}
          {currentView === 'marketplace' && <Marketplace />}
          {currentView === 'nutrition-dashboard' && <NutritionDashboard />}
          {currentView === 'meal-planner' && <MealPlanner />}
          {currentView === 'smart-grocery' && <SmartGroceryStore />}
          {currentView === 'doctor-consultation' && <DoctorConsultation />}
          {currentView === 'admin-dashboard' && <AdminDashboard />}
          {currentView === 'restaurant-dashboard' && <RestaurantDashboard />}
          {currentView === 'doctor-dashboard' && <DoctorDashboard />}
        </main>
      </div>

      {/* Mobile Sticky Bottom Tab Navigation (Mimics Swiggy Mobile Layout in center panel) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#091F17]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-emerald-500/10 flex items-center justify-around z-40 lg:hidden px-2 shadow-2xl">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentView('marketplace')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'marketplace' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400"
        >
          <Bot className="w-5 h-5 text-blue-500 animate-bounce" />
          <span>AI Coach</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Orders</span>
        </button>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Global Drawers & Overlay Modals */}
      <MealDetailModal />
      <AIAssistantModal />
      <HealthProfileModal />
      <CartDrawer />
      <OrderTrackingModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
