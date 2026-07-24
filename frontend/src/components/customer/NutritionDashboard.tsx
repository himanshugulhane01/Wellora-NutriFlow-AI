import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Activity, 
  Droplets, 
  Award, 
  TrendingUp, 
  Heart, 
  Plus
} from 'lucide-react';

export const NutritionDashboard: React.FC = () => {
  const { healthProfile } = useApp();
  const [consumedCalories] = useState(1320);
  const [consumedProtein] = useState(84);
  const [consumedWater, setConsumedWater] = useState(2.2);

  const calPercentage = Math.min(100, Math.round((consumedCalories / healthProfile.dailyCalorieTarget) * 100));
  const proteinPercentage = Math.min(100, Math.round((consumedProtein / healthProfile.dailyProteinTarget) * 100));
  const waterPercentage = Math.min(100, Math.round((consumedWater / healthProfile.waterIntakeLiters) * 100));

  const addWater = () => {
    setConsumedWater(prev => +(prev + 0.25).toFixed(2));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Activity className="w-3.5 h-3.5" />
            <span>Biometric Longevity Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            AI Nutrition & Health Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time biometric sync with continuous glucose monitoring & macro compliance.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl font-['Outfit']">
            {healthProfile.healthScore}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Overall Health Score</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Optimal Metabolism Zone</div>
          </div>
        </div>
      </div>

      {/* Main Gauges Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gauge 1: Calories */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-['Outfit']">Daily Energy Target</h3>
                <p className="text-xs text-slate-400">{consumedCalories} / {healthProfile.dailyCalorieTarget} kcal</p>
              </div>
            </div>
            <span className="text-lg font-black text-orange-500 font-['Outfit']">{calPercentage}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700" style={{ width: `${calPercentage}%` }}></div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Remaining: <strong className="text-slate-900 dark:text-white">{healthProfile.dailyCalorieTarget - consumedCalories} kcal</strong></span>
            <span className="text-emerald-500 font-bold">Calorie Deficit</span>
          </div>
        </div>

        {/* Gauge 2: Protein Target */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-['Outfit']">Bio-Protein Goal</h3>
                <p className="text-xs text-slate-400">{consumedProtein}g / {healthProfile.dailyProteinTarget}g protein</p>
              </div>
            </div>
            <span className="text-lg font-black text-emerald-500 font-['Outfit']">{proteinPercentage}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" style={{ width: `${proteinPercentage}%` }}></div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Needed: <strong className="text-slate-900 dark:text-white">{healthProfile.dailyProteinTarget - consumedProtein}g</strong></span>
            <span className="text-emerald-500 font-bold">Muscle Repair Safe</span>
          </div>
        </div>

        {/* Gauge 3: Hydration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-['Outfit']">Hydration Telemetry</h3>
                <p className="text-xs text-slate-400">{consumedWater}L / {healthProfile.waterIntakeLiters}L</p>
              </div>
            </div>
            <span className="text-lg font-black text-blue-500 font-['Outfit']">{waterPercentage}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700" style={{ width: `${waterPercentage}%` }}></div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={addWater}
              className="px-3 py-1 rounded-xl bg-blue-500 text-white font-bold flex items-center gap-1 hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> +250ml Glass
            </button>
            <span className="text-blue-500 font-bold">Hydration Optimal</span>
          </div>
        </div>

      </div>

      {/* Weekly Visual Progress Chart Bar */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
              7-Day Macro & Calorie Trends
            </h2>
            <p className="text-xs text-slate-500">Continuous AI assessment against target glycemic window</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Protein
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-orange-500">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Calories
            </span>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="grid grid-cols-7 gap-3 items-end h-48 pt-6 border-b border-slate-100 dark:border-slate-800 pb-2">
          {[
            { day: 'Mon', calHeight: '65%', proHeight: '80%' },
            { day: 'Tue', calHeight: '75%', proHeight: '85%' },
            { day: 'Wed', calHeight: '70%', proHeight: '90%' },
            { day: 'Thu', calHeight: '82%', proHeight: '78%' },
            { day: 'Fri', calHeight: '90%', proHeight: '95%' },
            { day: 'Sat', calHeight: '60%', proHeight: '85%' },
            { day: 'Sun (Today)', calHeight: '72%', proHeight: '88%' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                <div 
                  className="w-3 sm:w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all group-hover:brightness-110" 
                  style={{ height: item.proHeight }}
                ></div>
                <div 
                  className="w-3 sm:w-5 bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all group-hover:brightness-110" 
                  style={{ height: item.calHeight }}
                ></div>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Badges & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">PCOS Shield 14-Day</div>
            <div className="text-xs text-slate-500">Zero insulin spikes</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Protein Master</div>
            <div className="text-xs text-slate-500">110g daily consistency</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Hydro Champion</div>
            <div className="text-xs text-slate-500">2.8L water target hit</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Heart Resilient</div>
            <div className="text-xs text-slate-500">Low sodium verified</div>
          </div>
        </div>
      </div>

    </div>
  );
};
