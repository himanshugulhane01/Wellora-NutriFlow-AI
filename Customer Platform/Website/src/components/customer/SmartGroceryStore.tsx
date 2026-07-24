import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_GROCERY_ITEMS } from '../../data/mockData';
import { 
  Leaf, 
  ShieldCheck, 
  Plus, 
  Search, 
  Sparkles
} from 'lucide-react';

export const SmartGroceryStore: React.FC = () => {
  const { addGroceryToCart, healthProfile } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  const categories = ['All', 'Vegetables', 'Fruits', 'Protein', 'Organic Dairy', 'Supplements', 'Healthy Snacks'];

  const filteredItems = MOCK_GROCERY_ITEMS.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchQ = item.name.toLowerCase().includes(query.toLowerCase()) || item.nutritionTag.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
            <Leaf className="w-3.5 h-3.5" />
            <span>100% Certified Organic & Non-GMO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit']">
            Smart Organic Grocery Store
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl">
            Clinically vetted ingredients & organic pantry staples tailored for {healthProfile.name}'s bio-targets.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-300" />
          <span>Auto-Substituted for {healthProfile.diseases[0] || 'Health'}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organic spinach, Hass avocado, whey isolate..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.isOrganic && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                    ORGANIC
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Outfit']">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Unit: {item.unit}</p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" /> {item.nutritionTag}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Price</span>
                <div className="text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                  ₹{item.price}
                </div>
              </div>

              <button
                onClick={() => addGroceryToCart(item)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
