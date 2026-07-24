import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
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

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <main>
          {currentView === 'landing' && (
            <>
              <HeroSection />
              <HowItWorks />
              <CategoryGrid />
              <FeatureSection />
              <PricingSection />
            </>
          )}

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

      <Footer />

      {/* Global Drawers & Overlay Modals */}
      <MealDetailModal />
      <AIAssistantModal />
      <HealthProfileModal />
      <CartDrawer />
      <OrderTrackingModal />
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
