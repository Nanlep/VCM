
import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, LifeBuoy, Mail, ExternalLink } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'support';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'support', label: 'Support & SLA', icon: LifeBuoy },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[85vh] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-slate-100 text-slate-500 transition-colors md:hidden"
        >
            <X size={20} />
        </button>

        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0 flex flex-col">
            <div className="p-6 border-b border-slate-200 hidden md:block">
                <div className="font-bold text-slate-800 text-lg tracking-tight flex items-center gap-2">
                    <Shield size={20} className="text-brand-600" /> Legal & Help
                </div>
            </div>
            
            <div className="flex md:flex-col overflow-x-auto md:overflow-visible p-2 md:p-4 gap-2">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as LegalTab)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                isActive 
                                ? 'bg-white text-brand-700 shadow-sm border border-slate-200 ring-1 ring-brand-500/20' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <tab.icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <div className="mt-auto p-6 hidden md:block">
                <div className="text-xs text-slate-400">
                    Version 1.2.0<br/>
                    Updated: Oct 2023
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 bg-white relative custom-scrollbar">
             <button onClick={onClose} className="absolute top-6 right-6 hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors">
                <span className="text-xs font-medium uppercase tracking-wider">Close</span>
                <X size={20} />
            </button>

            <div className="max-w-3xl mx-auto">
                {activeTab === 'privacy' && <PrivacyContent />}
                {activeTab === 'terms' && <TermsContent />}
                {activeTab === 'support' && <SupportContent />}
            </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyContent = () => (
    <div className="space-y-6 text-slate-600 leading-relaxed">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h2>
        
        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Introduction</h3>
            <p>Vector Clarity Mapper ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our application.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Data Collection</h3>
            <p className="mb-2">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Personal Identification:</strong> Name, email address, and job title when you register.</li>
                <li><strong>Strategic Data:</strong> Vision statements, objectives, initiative names, and voting scores entered into the platform.</li>
                <li><strong>Usage Data:</strong> Information about how you use the application, including session duration and feature interaction.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Data Usage</h3>
            <p>We use the collected data to:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Provide, operate, and maintain our services.</li>
                <li>Improve, personalize, and expand our platform.</li>
                <li>Process transactions and send related information (invoices, confirmations).</li>
                <li>Generate aggregated, anonymized benchmarks (e.g., "Average Alignment Score across industries").</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Data Security</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 my-4">
                <div className="flex items-center gap-2 font-bold text-brand-700 mb-2">
                    <Shield size={18} /> Enterprise-Grade Security
                </div>
                <p className="text-sm">
                    We implement security measures designed to protect your data, including HTTPS encryption in transit and AES-256 encryption at rest. Our infrastructure is hosted on SOC 2 Type 2 compliant providers.
                </p>
            </div>
            <p>However, no method of transmission over the internet is 100% secure. We strive to use commercially acceptable means to protect your data but cannot guarantee absolute security.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">5. Your Rights (GDPR & CCPA)</h3>
            <p>Depending on your location, you may have rights to access, correct, delete, or restrict the use of your personal data. To exercise these rights, please contact our Data Protection Officer at <a href="mailto:privacy@vectorclarity.com" className="text-brand-600 underline">privacy@vectorclarity.com</a>.</p>
        </section>
    </div>
);

const TermsContent = () => (
    <div className="space-y-6 text-slate-600 leading-relaxed">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h2>
        
        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h3>
            <p>By accessing and using Vector Clarity Mapper, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. SaaS License</h3>
            <p>We grant you a limited, non-exclusive, non-transferable, and revocable license to use the Service for your internal business purposes, subject to these Terms.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. User Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Maintaining the confidentiality of your account credentials.</li>
                <li>All activities that occur under your account.</li>
                <li>Ensuring your data does not violate any applicable laws or third-party rights.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Payments & Refunds</h3>
            <p>Services are billed on a subscription or per-session basis. All payments are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">5. Termination</h3>
            <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">6. Disclaimer</h3>
            <p className="uppercase text-xs font-bold text-slate-400 mb-1">Limitation of Liability</p>
            <p>In no event shall Vector Clarity Mapper, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
        </section>
    </div>
);

const SupportContent = () => (
    <div className="space-y-8 text-slate-600 leading-relaxed">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Support & SLA</h2>
        <p className="text-lg text-slate-500">We are here to help you align your team and troubleshoot any issues.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-4">
                    <Mail size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
                <p className="text-sm mb-4">For general inquiries, billing, and technical troubleshooting.</p>
                <a href="mailto:support@vectorclarity.com" className="text-brand-700 font-bold text-sm flex items-center gap-2 hover:underline">
                    support@vectorclarity.com <ExternalLink size={12} />
                </a>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-4">
                    <Building2 size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Enterprise Sales</h3>
                <p className="text-sm mb-4">For custom contracts, SSO setup, and dedicated account management.</p>
                <a href="mailto:sales@vectorclarity.com" className="text-slate-700 font-bold text-sm flex items-center gap-2 hover:underline">
                    sales@vectorclarity.com <ExternalLink size={12} />
                </a>
            </div>
        </div>

        <section className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Service Level Agreements (SLA)</h3>
            
            <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Plan Level</th>
                            <th className="px-6 py-4">Initial Response Time</th>
                            <th className="px-6 py-4">Support Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="bg-white">
                            <td className="px-6 py-4 font-bold text-slate-800">Free Starter</td>
                            <td className="px-6 py-4">48 Hours</td>
                            <td className="px-6 py-4">Community Only</td>
                        </tr>
                        <tr className="bg-white">
                            <td className="px-6 py-4 font-bold text-brand-600">Pro Subscription</td>
                            <td className="px-6 py-4">12 Hours</td>
                            <td className="px-6 py-4">Mon-Fri, 9am-5pm EST</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                            <td className="px-6 py-4 font-bold text-slate-900">Enterprise</td>
                            <td className="px-6 py-4">1 Hour (Critical)</td>
                            <td className="px-6 py-4">24/7 Dedicated Support</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
);

// Icon component for support section
function Building2({ size }: { size: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
            <path d="M10 6h4"/>
            <path d="M10 10h4"/>
            <path d="M10 14h4"/>
            <path d="M10 18h4"/>
        </svg>
    )
}
