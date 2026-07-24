import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MEALS } from '../../data/mockData';
import { 
  Calendar as CalendarIcon, 
  RotateCw, 
  ShoppingCart
} from 'lucide-react';

export const MealPlanner: React.FC = () => {
  const { setCurrentView, healthProfile } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const weeklySchedule = days.map((day, i) => ({
    day,
    breakfast: MOCK_MEALS[4], // Berry Acai Bowl
    lunch: MOCK_MEALS[0],     // Salmon Bowl
    dinner: MOCK_MEALS[1],    // Falafel Wrap
    snack: MOCK_MEALS[5],     // Ayurvedic Lentil Soup
    totalCalories: 1420 + (i * 20),
    totalProtein: 96 + (i * 2),
  }));

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Planner Bar */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Autonomous Weekly Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            AI Weekly Meal Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Auto-tuned for {healthProfile.name} ({healthProfile.fitnessGoal} • {healthProfile.dailyCalorieTarget} kcal).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <RotateCw className={`w-4 h-4 text-emerald-500 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Week'}</span>
          </button>

          <button
            onClick={() => setCurrentView('smart-grocery')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Export to Smart Grocery</span>
          </button>
        </div>
      </div>

      {/* Days Calendar Cards */}
      <div className="space-y-6">
        {weeklySchedule.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all space-y-4"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {item.day}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span>Calories: <strong className="text-orange-500">{item.totalCalories} kcal</strong></span>
                <span>Protein: <strong className="text-emerald-500">{item.totalProtein}g</strong></span>
              </div>
            </div>

            {/* 4 Meals Grid (Breakfast, Lunch, Dinner, Snack) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Breakfast */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Breakfast</span>
                  <span>8:00 AM</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={item.breakfast.image} alt={item.breakfast.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.breakfast.name}</h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.breakfast.macros.calories} kcal • {item.breakfast.macros.protein}g P</p>
                  </div>
                </div>
              </div>

              {/* Lunch */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Lunch</span>
                  <span>1:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={item.lunch.image} alt={item.lunch.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.lunch.name}</h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.lunch.macros.calories} kcal • {item.lunch.macros.protein}g P</p>
                  </div>
                </div>
              </div>

              {/* Dinner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Dinner</span>
                  <span>7:30 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={item.dinner.image} alt={item.dinner.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.dinner.name}</h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.dinner.macros.calories} kcal • {item.dinner.macros.protein}g P</p>
                  </div>
                </div>
              </div>

              {/* Snack */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Evening Snack</span>
                  <span>4:30 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={item.snack.image} alt={item.snack.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.snack.name}</h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.snack.macros.calories} kcal • {item.snack.macros.protein}g P</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
