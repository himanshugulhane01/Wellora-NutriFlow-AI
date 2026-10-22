import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Sparkles } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { setIsAuthModalOpen, setAuthModalDefaultMode } = useApp();
  const [isAnnual, setIsAnnual] = useState(true);

  const handlePlanCTA = () => {
    setAuthModalDefaultMode('signup');
    setIsAuthModalOpen(true);
  };

  const plans = [
    {
      name: "NutriBasic",
      priceMonthly: 0,
      priceAnnual: 0,
      desc: "Essential healthy food ordering & standard macro view.",
      features: [
        "Access to 500+ certified kitchens",
        "Basic macro counts (Calories & Protein)",
        "Standard delivery priority",
        "Manual food logger",
      ],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "NutriPro AI",
      priceMonthly: 799,
      priceAnnual: 599,
      desc: "Full AI personalization, glycemic guard & weekly meal planner.",
      features: [
        "Everything in NutriBasic",
        "Unlimited Wellora AI consultations",
        "PCOS & Diabetic Disease-Aware Filtering",
        "Explainable AI Meal Recommendations",
        "Automated Weekly Meal Planner",
        "Express 15-min delivery priority",
        "Smart Grocery 1-Click Export",
      ],
      cta: "Start 14-Day Free Trial",
      highlight: true,
      badge: "MOST POPULAR",
    },
    {
      name: "NutriMax Care",
      priceMonthly: 1999,
      priceAnnual: 1499,
      desc: "Clinical healthcare, CGM wearable sync & doctor telehealth.",
      features: [
        "Everything in NutriPro AI",
        "Monthly Doctor / Dietitian Telehealth Consult",
        "Continuous Glucose Monitor (CGM) Live Telemetry",
        "Customized Clinical Lab Test Diet Protocols",
        "Dedicated Personal Health Concierge",
        "Family Sharing (Up to 4 Profiles)",
      ],
      cta: "Unlock Medical Care",
      highlight: false,
    },
  ];

  return (
    <section id="for-partners" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            Transparent Health Subscriptions
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Invest in Your Biological Longevity
          </h2>
          <p className="text-slate-600 text-base">
            Choose the level of AI intelligence and clinical medical support your body deserves.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-slate-200 p-1 relative transition-colors focus:outline-none"
            >
              <div className={`w-6 h-6 rounded-full bg-emerald-500 shadow-md transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              <span>Annual Plan</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                SAVE 25%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={idx}
                className={`relative p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-[#034B36] to-[#053728] text-white shadow-2xl shadow-emerald-900/20 border-2 border-emerald-400 scale-105 z-10'
                    : 'bg-white border border-slate-200 text-slate-900 shadow-md hover:shadow-xl'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[11px] font-black tracking-wider uppercase shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-extrabold font-['Outfit']">{plan.name}</h3>
                    {plan.highlight && <Sparkles className="w-5 h-5 text-amber-300" />}
                  </div>
                  <p className={`text-xs mb-6 ${plan.highlight ? 'text-emerald-100/80' : 'text-slate-500'}`}>
                    {plan.desc}
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-extrabold font-['Outfit']">₹{price}</span>
                    <span className={`text-xs ml-2 font-medium ${plan.highlight ? 'text-emerald-200' : 'text-slate-500'}`}>
                      / month {isAnnual && price > 0 ? '(billed annually)' : ''}
                    </span>
                  </div>

                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs leading-snug">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.highlight ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={plan.highlight ? 'text-white/90' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePlanCTA}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/25'
                      : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
