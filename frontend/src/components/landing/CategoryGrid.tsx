import React from 'react';
import { useApp } from '../../context/AppContext';
import type { CategoryFilter } from '../../types';
import { 
  Flame, 
  Dumbbell, 
  Heart, 
  Activity, 
  ShieldAlert, 
  Baby, 
  Leaf, 
  Zap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { setActiveCategory, setCurrentView } = useApp();

  const categoriesList: { name: CategoryFilter; desc: string; icon: React.ElementType; color: string }[] = [
    { name: 'PCOS', desc: 'Low GI & Anti-inflammatory', icon: Sparkles, color: 'from-pink-500 to-rose-500' },
    { name: 'Diabetes Friendly', desc: 'Zero glycemic spike recipes', icon: Activity, color: 'from-blue-500 to-cyan-500' },
    { name: 'High Protein', desc: '35g+ bioavailable protein', icon: Dumbbell, color: 'from-emerald-500 to-green-600' },
    { name: 'Heart Healthy', desc: 'Omega-3 & low sodium', icon: Heart, color: 'from-red-500 to-orange-500' },
    { name: 'Weight Loss', desc: 'Calorie deficit perfection', icon: Flame, color: 'from-amber-500 to-yellow-500' },
    { name: 'Keto', desc: '<10g net carbs per meal', icon: Zap, color: 'from-purple-500 to-indigo-500' },
    { name: 'Kidney Friendly', desc: 'Controlled potassium & sodium', icon: ShieldAlert, color: 'from-teal-500 to-emerald-500' },
    { name: 'Thyroid', desc: 'Selenium & iodine balanced', icon: Sparkles, color: 'from-sky-500 to-blue-600' },
    { name: 'Pregnancy', desc: 'High Folate & Choline', icon: Baby, color: 'from-fuchsia-500 to-pink-500' },
    { name: 'Kids Nutrition', desc: 'Growth nutrients, zero junk', icon: Baby, color: 'from-amber-400 to-orange-400' },
    { name: 'Senior Citizen', desc: 'Soft digest, mineral dense', icon: Heart, color: 'from-slate-600 to-slate-800' },
    { name: 'Vegan', desc: '100% plant-based clean protein', icon: Leaf, color: 'from-green-500 to-emerald-600' },
  ];

  const handleCategoryClick = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setCurrentView('marketplace');
  };

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Personalized Medical Goals
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit'] mt-3">
              Explore Targeted Nutrition
            </h2>
          </div>
          <button
            onClick={() => { setActiveCategory('All'); setCurrentView('marketplace'); }}
            className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:gap-3 transition-all"
          >
            <span>View All 18 Health Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesList.map((cat, i) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={i}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all text-left flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-emerald-500 transition-colors"></span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-['Outfit']">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
