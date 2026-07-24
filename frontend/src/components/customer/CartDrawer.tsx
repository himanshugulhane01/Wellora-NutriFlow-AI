import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MapPin
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, placeOrder } = useApp();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.meal.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const aiClinicalFee = 15;
  const total = subtotal + deliveryFee + aiClinicalFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-['Outfit']">Your Healthy Basket</h3>
              <p className="text-xs text-slate-400">{cart.length} item(s)</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 my-4 overflow-y-auto space-y-4 pr-1">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-500">Your cart is currently empty</p>
              <p className="text-xs text-slate-400">Add bio-matched meals or smart organic grocery items.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.meal.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex items-center gap-3"
              >
                <img src={item.meal.image} alt={item.meal.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate font-['Outfit']">
                    {item.meal.name}
                  </h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {item.meal.macros.calories} kcal • {item.meal.macros.protein}g Protein
                  </p>
                  <div className="text-xs font-black text-slate-900 dark:text-white mt-1">
                    ₹{item.meal.price * item.quantity}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.meal.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            
            {/* Delivery Address */}
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold truncate">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">Penthouse 14B, Green Valley</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Change</span>
            </div>

            {/* Bill Details */}
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Express Delivery</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>AI Clinical Verification Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{aiClinicalFee}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Total Payable</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-['Outfit']">₹{total}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Place Order & Track Live</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
