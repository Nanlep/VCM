
import React, { useState } from 'react';
import { X, Briefcase, Award, Linkedin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { supabase, isBackendConfigured } from '../services/supabase';
import { logAuditAction } from '../services/auditService';
import { AUDIT_EVENTS } from '../constants';

interface ConsultantApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultantApplicationModal: React.FC<ConsultantApplicationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    linkedin: '',
    experience: '1-3',
    methodology: '',
    motivation: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Log Audit
    await logAuditAction(formData.email, AUDIT_EVENTS.CONSULTANT_APPLICATION, undefined, { role: 'applicant' });

    // 2. Persist to DB (if configured)
    if (isBackendConfigured()) {
        const { error } = await supabase.from('consultant_applications').insert([{
            full_name: formData.fullName,
            email: formData.email,
            linkedin_url: formData.linkedin,
            years_experience: formData.experience,
            methodology: formData.methodology,
            motivation: formData.motivation
        }]);
        if (error) console.error("Application Error:", error);
    } else {
        // Simulate API delay for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsLoading(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative flex flex-col md:flex-row">
        
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-brand-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                        <Briefcase size={24} className="text-brand-300"/>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Partner Program</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Join an elite network of Agile Facilitators and Strategy Consultants using Vector Clarity Mapper to drive enterprise alignment.
                    </p>
                </div>
                
                <div className="space-y-4 mt-8 text-sm">
                    <div className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 size={16} className="text-brand-400" />
                        <span>White-label Reports</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 size={16} className="text-brand-400" />
                        <span>Client Referral Network</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 size={16} className="text-brand-400" />
                        <span>Expert Certification</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Form Area */}
        <div className="w-full md:w-2/3 p-8 bg-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600">
                <X size={24} />
            </button>

            {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Apply for Certification</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input 
                                required
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="Jane Doe"
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Years Experience</label>
                            <select 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                                value={formData.experience}
                                onChange={e => setFormData({...formData, experience: e.target.value})}
                            >
                                <option value="1-3">1-3 Years</option>
                                <option value="4-7">4-7 Years</option>
                                <option value="8-10">8-10 Years</option>
                                <option value="10+">10+ Years</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Work Email</label>
                            <input 
                                required
                                type="email"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="jane@agency.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">LinkedIn <Linkedin size={10}/></label>
                            <input 
                                type="url"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="linkedin.com/in/..."
                                value={formData.linkedin}
                                onChange={e => setFormData({...formData, linkedin: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Methodology</label>
                        <input 
                            required
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. SAFe, Scrum, Lean Portfolio Management"
                            value={formData.methodology}
                            onChange={e => setFormData({...formData, methodology: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Why do you want to partner?</label>
                        <textarea 
                            required
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                            placeholder="Briefly describe your consulting practice..."
                            value={formData.motivation}
                            onChange={e => setFormData({...formData, motivation: e.target.value})}
                        />
                    </div>

                    <Button disabled={isLoading} className="w-full h-12 text-sm font-bold shadow-lg shadow-brand-500/20">
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </form>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <Award size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Application Received</h3>
                    <p className="text-slate-500 mb-8 max-w-sm">
                        Thank you for your interest, {formData.fullName}. Our partnership team reviews applications weekly. You will hear from us via email shortly.
                    </p>
                    <Button variant="outline" onClick={onClose}>Return to Homepage</Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
