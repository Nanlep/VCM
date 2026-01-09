
import React, { useState } from 'react';
import { ShieldCheck, CreditCard, X, Lock, Zap, Crown, Building2, Gem } from 'lucide-react';
import { Button } from './Button';
import { PRICING } from '../constants';

export type PricingMode = 'limit' | 'expired';
export type PlanType = 'subscription' | 'annual' | 'custom';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (plan: PlanType) => void;
  mode: PricingMode;
  sessionName?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onConfirm, mode, sessionName }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('subscription');

  if (!isOpen) return null;

  const isExpired = mode === 'expired';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden transform transition-all">
        <div className="flex flex-col md:flex-row">
          
          {/* Left Header/Info Panel */}
          <div className={`md:w-1/3 p-8 text-white flex flex-col justify-between relative overflow-hidden ${isExpired ? 'bg-slate-800' : 'bg-gradient-to-br from-brand-700 to-brand-900'}`}>
             {/* Background Decor */}
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-400 rounded-full blur-3xl"></div>
             </div>

             <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-white/20 text-white'}`}>
                   {isExpired ? <Lock size={24} /> : <Zap size={24} />}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                   {isExpired ? 'Unlock Session' : 'Monthly Limit Reached'}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                   {isExpired 
                     ? `Restore write access to "${sessionName || 'Strategy Session'}".` 
                     : 'You have used your free session for this month. Subscribe to continue creating sessions.'}
                </p>
             </div>

             <div className="relative z-10 mt-8 space-y-3 text-sm text-white/80">
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-brand-300" /> Secure Payment
                 </div>
                 <div className="flex items-center gap-3">
                    <Zap size={16} className="text-brand-300" /> Instant Access
                 </div>
             </div>
          </div>

          {/* Right Options Panel */}
          <div className="md:w-2/3 p-8 bg-white relative overflow-y-auto max-h-[90vh]">
             <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors">
                <X size={24} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-6">Choose your access level</h3>

            <div className="grid grid-cols-1 gap-4 mb-8">
                {/* Monthly Subscription */}
                <div 
                   onClick={() => setSelectedPlan('subscription')}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between relative overflow-hidden ${selectedPlan === 'subscription' ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500' : 'border-slate-100 hover:border-slate-300'}`}
                >
                     {selectedPlan === 'subscription' && (
                         <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                     )}
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPlan === 'subscription' ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Crown size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Pro Monthly</div>
                            <div className="text-xs text-slate-500">Up to {PRICING.SUBSCRIPTION_LIMIT} sessions / mo</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-slate-900 text-lg">${PRICING.PRICE_SUBSCRIPTION.toFixed(2)}</div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">/ Month</div>
                    </div>
                </div>

                {/* Annual Plan */}
                <div 
                   onClick={() => setSelectedPlan('annual')}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between relative overflow-hidden ${selectedPlan === 'annual' ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500' : 'border-slate-100 hover:border-slate-300'}`}
                >
                     {selectedPlan === 'annual' && (
                         <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">BEST VALUE</div>
                     )}
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPlan === 'annual' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Gem size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Annual + Expert</div>
                            <div className="text-xs text-slate-500">Unlimited + 60m Consultation</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-slate-900 text-lg">${PRICING.PRICE_ANNUAL.toFixed(0)}</div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">/ Year</div>
                    </div>
                </div>

                {/* Custom Enterprise */}
                <div 
                   onClick={() => setSelectedPlan('custom')}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedPlan === 'custom' ? 'border-slate-700 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPlan === 'custom' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Building2 size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Enterprise</div>
                            <div className="text-xs text-slate-500">SSO & Audit Logs</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-slate-900 text-sm">Contact</div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Sales</div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <Button className="flex-1 gap-2 h-12 text-base shadow-lg shadow-brand-500/20" size="lg" onClick={() => onConfirm(selectedPlan)}>
                    {selectedPlan === 'custom' ? 'Contact Sales' : (
                        <>
                           <CreditCard size={18} />
                           Proceed to Pay
                        </>
                    )}
                </Button>
                <Button variant="ghost" className="px-6" onClick={onClose}>
                    Cancel
                </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
