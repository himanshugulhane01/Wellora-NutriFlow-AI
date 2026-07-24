import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  PlatformView,
  CategoryFilter,
  HealthProfile,
  Meal,
  CartItem,
  Order,
  GroceryItem,
  AIChatMessage
} from '../types';
import {
  INITIAL_HEALTH_PROFILE,
  MOCK_MEALS,
  MOCK_ACTIVE_ORDER
} from '../data/mockData';
import {
  authService,
  mealsService,
  ordersService,
  healthProfileService,
  aiService
} from '../services';

interface AppContextType {
  currentView: PlatformView;
  setCurrentView: (view: PlatformView) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeCategory: CategoryFilter;
  setActiveCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  healthProfile: HealthProfile;
  setHealthProfile: React.Dispatch<React.SetStateAction<HealthProfile>>;
  cart: CartItem[];
  addToCart: (meal: Meal) => void;
  removeFromCart: (mealId: string) => void;
  clearCart: () => void;
  selectedMealForDetail: Meal | null;
  setSelectedMealForDetail: (meal: Meal | null) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  activeOrder: Order | null;
  placeOrder: () => void;
  aiChatMessages: AIChatMessage[];
  sendAIMessage: (text: string) => void;
  addGroceryToCart: (item: GroceryItem) => void;
  meals: Meal[];
  isLoadingMeals: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<PlatformView>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Health Profile State (Starts with default mock, syncs with backend on load)
  const [healthProfile, setHealthProfile] = useState<HealthProfile>(INITIAL_HEALTH_PROFILE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<Meal | null>(null);
  
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(MOCK_ACTIVE_ORDER);

  // Meals & Restaurants dynamic list
  const [meals, setMeals] = useState<Meal[]>(MOCK_MEALS);
  const [isLoadingMeals, setIsLoadingMeals] = useState<boolean>(false);

  // Chatbot Messages State
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: `Hello! I am NutriFlow AI. I noticed your PCOS and mild insulin sensitivity profile. I've updated your meal recommendations to prioritize low-glycemic fats (Omega-3) and fiber. How can I assist your health today?`,
      timestamp: 'Just now',
      healthInsight: 'PCOS Friendly Macro Target: 38g Protein | <25g Carbs per meal.'
    }
  ]);

  // Sync dark class on html root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // ─── INITIAL SYNC & AUTH ──────────────────────────────────────────────────
  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Auto-login default user if not already authenticated
        if (!authService.isAuthenticated()) {
          console.log('🔑 Performing automatic demo login...');
          const authRes = await authService.login({
            email: 'priya@nutriflow.ai',
            password: 'password123'
          });
          if (authRes.success) {
            authService.saveSession(authRes.data.token, authRes.data.user);
          }
        }

        // 2. Fetch real User Health Profile from Backend
        const profileRes = await healthProfileService.get();
        if (profileRes.success && profileRes.data) {
          const profileData = profileRes.data as any;
          setHealthProfile(prev => ({
            ...prev,
            name: 'Priya Sharma',
            age: profileData.age,
            heightCm: profileData.heightCm,
            weightKg: profileData.weightKg,
            targetWeightKg: profileData.targetWeightKg,
            fitnessGoal: profileData.fitnessGoal as any,
            dailyCalorieTarget: profileData.dailyCalorieTarget,
            diseases: profileData.diseases ? JSON.parse(profileData.diseases) : prev.diseases,
            bmi: profileData.bmi || prev.bmi,
          }));
        }

        // 3. Fetch real meals list
        setIsLoadingMeals(true);
        const mealsRes = await mealsService.getAll();
        if (mealsRes.success && mealsRes.data.length > 0) {
          // Adapt backend Meal model to frontend Meal interface
          const adaptedMeals: Meal[] = mealsRes.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            restaurantId: m.restaurantId,
            restaurantName: m.restaurant?.name || 'GreenBowl Kitchen',
            image: m.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            price: m.price,
            rating: m.healthScore ? Math.round((m.healthScore / 2) * 10) / 10 : 4.5,
            reviewCount: 120,
            prepTime: `${m.restaurant?.deliveryMin || 25} min`,
            macros: {
              calories: m.calories,
              protein: m.protein,
              carbs: m.carbs,
              fat: m.fat,
              fiber: m.fiber || 5,
              sugar: m.sugar || 4,
              glycemicIndex: m.glycemicIndex || 35,
            },
            categories: m.tags ? JSON.parse(m.tags) : ['PCOS', 'Diabetes Friendly'],
            aiMatchScore: Math.round(m.healthScore * 10),
            healthRiskScore: m.healthScore > 8 ? 'Low' : 'Moderate',
            aiExplanation: m.description,
            ingredients: m.description.split(', '),
            preparation: 'Freshly prepared by certified culinary partners.',
            isNutritionVerified: m.isVeg,
            dietaryBadges: m.tags ? JSON.parse(m.tags) : ['Low GI', 'PCOS Safe']
          }));
          setMeals(adaptedMeals);
        }
        setIsLoadingMeals(false);

        // 4. Fetch Chat history
        const chatRes = await aiService.getHistory();
        if (chatRes.success && chatRes.data.length > 0) {
          const adaptedChat: AIChatMessage[] = chatRes.data.map((msg: any) => ({
            id: msg.id,
            sender: msg.role === 'user' ? 'user' : 'ai',
            text: msg.content,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setAiChatMessages(adaptedChat);
        }

      } catch (err) {
        console.warn('⚠️ Backend sync failed, using client mock mode.', err);
        setIsLoadingMeals(false);
      }
    };

    initApp();
  }, []);

  // Update health profile on backend whenever locally saved
  const handleSaveHealthProfile = async (updated: HealthProfile) => {
    setHealthProfile(updated);
    try {
      if (authService.isAuthenticated()) {
        await healthProfileService.update({
          age: updated.age,
          heightCm: updated.heightCm,
          weightKg: updated.weightKg,
          targetWeightKg: updated.targetWeightKg,
          fitnessGoal: updated.fitnessGoal,
          dailyCalorieTarget: updated.dailyCalorieTarget,
          diseases: updated.diseases,
        });
      }
    } catch (err) {
      console.error('Failed to sync health profile update to backend:', err);
    }
  };

  const addToCart = (meal: Meal) => {
    setCart(prev => {
      const existing = prev.find(item => item.meal.id === meal.id);
      if (existing) {
        return prev.map(item =>
          item.meal.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { meal, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const addGroceryToCart = (item: GroceryItem) => {
    const pseudoMeal: Meal = {
      id: `grocery-${item.id}`,
      name: item.name,
      restaurantId: 'r-grocery',
      restaurantName: 'NutriFlow Smart Grocery',
      image: item.image,
      price: item.price,
      rating: item.rating,
      reviewCount: 99,
      prepTime: 'Instant Express',
      macros: { calories: 120, protein: 10, carbs: 5, fat: 3, fiber: 4, sugar: 1 },
      categories: ['Organic'],
      aiMatchScore: 99,
      healthRiskScore: 'Low',
      aiExplanation: `Fresh Organic Grocery item (${item.nutritionTag}).`,
      ingredients: [item.name],
      preparation: 'Fresh farm packaging.',
      isNutritionVerified: true,
      dietaryBadges: ['Organic', item.category]
    };
    addToCart(pseudoMeal);
  };

  const removeFromCart = (mealId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.meal.id === mealId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.meal.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.meal.id !== mealId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      if (authService.isAuthenticated()) {
        const orderItems = cart.map(i => ({
          mealId: i.meal.id.startsWith('grocery-') ? MOCK_MEALS[0].id : i.meal.id,
          quantity: i.quantity
        }));
        
        const res = await ordersService.place({
          restaurantId: 'r1',
          items: orderItems,
          instructions: 'Call upon arrival.'
        });

        if (res.success && res.data) {
          const backendOrder = res.data as any;
          const newOrder: Order = {
            id: backendOrder.id,
            items: [...cart],
            totalAmount: backendOrder.totalAmount,
            status: 'AI Verified',
            etaMinutes: 18,
            otpCode: '4819',
            deliveryPartner: {
              name: 'Arjun Mehta',
              phone: '+91 98112 34567',
              rating: 4.95,
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            },
            restaurantName: cart[0].meal.restaurantName,
            deliveryAddress: 'Penthouse 14B, Green Valley Heights, Tech District',
            createdAt: 'Just now'
          };
          setActiveOrder(newOrder);
        }
      }
    } catch (err) {
      console.warn('API placeOrder failed, running in fallback mode.', err);
      // Fallback
      const newOrder: Order = {
        id: `NF-${Math.floor(10000 + Math.random() * 90000)}`,
        items: [...cart],
        totalAmount: cart.reduce((acc, item) => acc + item.meal.price * item.quantity, 0),
        status: 'AI Verified',
        etaMinutes: 18,
        otpCode: '4819',
        deliveryPartner: {
          name: 'Arjun Mehta',
          phone: '+91 98112 34567',
          rating: 4.95,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
        restaurantName: cart[0].meal.restaurantName,
        deliveryAddress: 'Penthouse 14B, Green Valley Heights, Tech District',
        createdAt: 'Just now'
      };
      setActiveOrder(newOrder);
    }
    setCart([]);
    setIsCartOpen(false);
    setIsOrderTrackingOpen(true);
  };

  const sendAIMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiChatMessages(prev => [...prev, userMsg]);

    try {
      if (authService.isAuthenticated()) {
        const res = await aiService.chat(text);
        if (res.success) {
          const aiResponse: AIChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: res.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            healthInsight: 'AI Verified for PCOS & Low Glycemic Targets.'
          };
          setAiChatMessages(prev => [...prev, aiResponse]);
          return;
        }
      }
    } catch (err) {
      console.warn('API chatbot failed, running in fallback mode.', err);
    }

    // Fallback response if offline/API fails
    setTimeout(() => {
      let aiText = `I have analyzed your query regarding "${text}". Based on your PCOS & insulin response markers, maintaining high protein (35g+) and rich polyphenol fiber will prevent glucose spikes.`;
      let recMeal: Meal | undefined = undefined;

      if (text.toLowerCase().includes('recommend') || text.toLowerCase().includes('lunch') || text.toLowerCase().includes('dinner') || text.toLowerCase().includes('eat')) {
        recMeal = meals[0];
        aiText = `Here is your top AI-matched meal: ${meals[0].name} (98% Health Match). It delivers 38g protein with a low GI of 28.`;
      } else if (text.toLowerCase().includes('keto') || text.toLowerCase().includes('weight loss')) {
        recMeal = meals[2] || meals[0];
        aiText = `For zero-carbs & muscle maintenance, I recommend the ${recMeal.name} from Apex Fuel Lab.`;
      }

      const aiResponse: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: 'Just now',
        mealRecommendation: recMeal,
        healthInsight: 'AI Rule Engine: Verified safe for PCOS & Low Glycemic Targets.'
      };
      setAiChatMessages(prev => [...prev, aiResponse]);
    }, 800);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        isDarkMode,
        setIsDarkMode,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        healthProfile,
        setHealthProfile: handleSaveHealthProfile as any,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        selectedMealForDetail,
        setSelectedMealForDetail,
        isAIModalOpen,
        setIsAIModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isCartOpen,
        setIsCartOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        activeOrder,
        placeOrder,
        aiChatMessages,
        sendAIMessage,
        addGroceryToCart,
        meals,
        isLoadingMeals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
