import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Check } from 'lucide-react';

export const HealthProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, healthProfile, setHealthProfile } = useApp();

  const [form, setForm] = useState({ ...healthProfile });

  if (!isProfileModalOpen) return null;

  const diseaseOptions = [
    'PCOS',
    'Type-2 Diabetes',
    'Hypertension',
    'Thyroid (Hypo/Hyper)',
    'Kidney Disease',
    'Mild Insulin Sensitivity',
    'Gluten Intolerance'
  ];

  const toggleDisease = (d: string) => {
    setForm(prev => {
      const exists = prev.diseases.includes(d);
      return {
        ...prev,
        diseases: exists ? prev.diseases.filter(item => item !== d) : [...prev.diseases, d]
      };
    });
  };

  const handleSave = () => {
    setHealthProfile(form);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <User className="w-3.5 h-3.5" />
            <span>Clinical Biological Profile</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            Health & Medical Profile Manager
          </h2>
          <p className="text-xs text-slate-500">
            NutriFlow AI recalculates glycemic indexes and macro targets immediately upon updating metrics.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Basic Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Height (cm)</label>
              <input
                type="number"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Weight (kg)</label>
              <input
                type="number"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Target (kg)</label>
              <input
                type="number"
                value={form.targetWeightKg}
                onChange={(e) => setForm({ ...form, targetWeightKg: Number(e.target.value) })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Fitness Goal & Calorie Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Primary Fitness Goal</label>
              <select
                value={form.fitnessGoal}
                onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value as any })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="PCOS Relief">PCOS Relief & Insulin Control</option>
                <option value="Diabetes Control">Type-2 Diabetes Control</option>
                <option value="Weight Loss">Weight Loss & Fat Reduction</option>
                <option value="Muscle Gain">Muscle Building & Athletic</option>
                <option value="Heart Health">Heart Health & Low Lipid</option>
                <option value="General Wellness">General Wellness</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                value={form.dailyCalorieTarget}
                onChange={(e) => setForm({ ...form, dailyCalorieTarget: Number(e.target.value) })}
                className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Medical Conditions Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
              Medical Conditions & Disease History
            </label>
            <div className="flex flex-wrap gap-2">
              {diseaseOptions.map((d) => {
                const selected = form.diseases.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDisease(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25"
          >
            Save Health Profile
          </button>
        </div>

      </div>
    </div>
  );
};
