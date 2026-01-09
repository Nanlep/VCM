
import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from './Button';

export const ComplianceBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vcm_cookie_consent');
    if (!consent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vcm_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 p-4 z-[100] animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="bg-brand-500/20 p-2 rounded-lg text-brand-400 hidden md:block">
              <ShieldCheck size={24} />
           </div>
           <p className="text-sm text-slate-300">
             We use cookies to ensure you get the best experience. We also collect usage data for security auditing purposes (SOC 2 Compliance).
             <a href="#" className="text-brand-400 underline ml-1">Read Privacy Policy</a>
           </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Button size="sm" className="w-full md:w-auto" onClick={handleAccept}>Accept & Continue</Button>
           <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
        </div>
      </div>
    </div>
  );
};
