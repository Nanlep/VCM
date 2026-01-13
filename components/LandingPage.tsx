
import React, { useState } from 'react';
import { Button } from './Button';
import { 
  ArrowRight, CheckCircle2, Target, Zap, Crown, Coffee, Gem, 
  AlertTriangle, Briefcase, GitBranch, Map, Presentation, Info, 
  ShieldCheck, BarChart, Layout, Users, AlertOctagon, PieChart, 
  UserPlus, Layers, Search, Brain, MessageSquare, TrendingDown,
  Scale, Building, Landmark, Rocket
} from 'lucide-react';
import { PRICING } from '../constants';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xl tracking-tight">
            <Layout className="text-brand-600" /> VECTOR CLARITY
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLogin}>Login</Button>
            <Button onClick={onLogin}>Get Started Free</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden bg-white pb-20 pt-16 lg:pt-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-sm">
              <ShieldCheck size={16} /> Enterprise Strategic Alignment
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              Quantify Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-400">Team's Consensus.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Precision mapping for high-stakes decisions. Align co-founders, boards, and global teams in minutes. **First session is free.**
            </p>
            <Button size="lg" className="h-16 px-10 text-xl shadow-2xl shadow-brand-500/20 rounded-2xl" onClick={onLogin}>
              Create Free Session <ArrowRight className="ml-2" size={24} />
            </Button>
        </div>
      </header>

      {/* Expanded Use Cases Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-brand-600 font-black text-xs uppercase tracking-widest mb-2">High-Stakes Decision Frameworks</h2>
                <h3 className="text-4xl font-black text-slate-900">Advanced Business Use Cases</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Strategic Leadership Audit */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Brain size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 mb-2">Strategic Leadership Audit</h4>
                    <p className="text-slate-500 leading-relaxed text-xs">
                        Map technical debt vs. product vision. Ensure executive partners are aligned on who owns execution vs. who owns the roadmap.
                    </p>
                </div>

                {/* M&A Integration */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Building size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 mb-2">Post-Merger Synergy</h4>
                    <p className="text-slate-500 leading-relaxed text-xs">
                        Merge two company roadmaps objectively. Score incoming assets against existing vision to identify immediate "sunsets."
                    </p>
                </div>

                {/* Crisis Pivot */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <AlertOctagon size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 mb-2">The Crisis Pivot</h4>
                    <p className="text-slate-500 leading-relaxed text-sm text-xs">
                        Market conditions changed? Re-score initiatives in real-time to find the fastest path to stability with team buy-in.
                    </p>
                </div>

                {/* Resource Allocation */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 mb-2">Resource Allocation</h4>
                    <p className="text-slate-500 leading-relaxed text-xs">
                        Stop "loudest manager" hiring. Use Vector Scores to prioritize head-count for projects with the highest feasibility.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Pricing - Enterprise Focus */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-black text-slate-900 mb-4">Strategic Investment Plans</h2>
             <p className="text-slate-500 text-lg">Scalable alignment for startups to global enterprises.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Pilot */}
              <div className="p-8 rounded-3xl border border-slate-200 bg-white flex flex-col">
                 <h3 className="text-xl font-bold text-slate-900 mb-2">The Pilot</h3>
                 <div className="text-4xl font-black text-slate-900 mb-4">$0</div>
                 <p className="text-slate-500 mb-6 text-sm">Experience the Vector methodology with a single team session.</p>
                 <ul className="space-y-3 mb-8 text-sm flex-1">
                    <li className="flex gap-2 font-medium text-slate-700"><CheckCircle2 className="text-green-500" size={16}/> 1 High-Resolution Session</li>
                    <li className="flex gap-2 font-medium text-slate-700"><CheckCircle2 className="text-green-500" size={16}/> Up to 10 Team Members</li>
                    <li className="flex gap-2 font-medium text-slate-700"><CheckCircle2 className="text-green-500" size={16}/> Standard Export Tools</li>
                 </ul>
                 <Button variant="outline" className="w-full h-12" onClick={onLogin}>Try First Session</Button>
              </div>

              {/* Growth */}
              <div className="p-8 rounded-3xl border-2 border-brand-500 bg-brand-50 relative shadow-xl transform scale-105 z-10 flex flex-col">
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Growth</div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Management Pro</h3>
                 <div className="text-4xl font-black text-slate-900 mb-4">${PRICING.PRICE_MONTHLY}<span className="text-sm font-medium text-slate-400">/mo</span></div>
                 <p className="text-slate-500 mb-6 text-sm">Continuous alignment for fast-moving management teams.</p>
                 <ul className="space-y-3 mb-8 text-sm flex-1">
                    <li className="flex gap-2 font-medium text-slate-700"><CheckCircle2 className="text-brand-600" size={16}/> 15 Continuous Sessions / Mo</li>
                    <li className="flex gap-2 font-medium text-slate-700"><CheckCircle2 className="text-brand-600" size={16}/> AI Strategy Copilot</li>
                    <li className="flex gap-2 font-medium text-slate-700"><CheckCircle2 className="text-brand-600" size={16}/> Priority Support Slack</li>
                 </ul>
                 <Button className="w-full h-12" onClick={onLogin}>Start 14-Day Pro Trial</Button>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900 text-white flex flex-col">
                 <h3 className="text-xl font-bold mb-2 text-white">Enterprise OS</h3>
                 <div className="text-4xl font-black mb-4 text-brand-400">${PRICING.PRICE_ENTERPRISE}<span className="text-sm font-medium text-slate-500">/mo</span></div>
                 <p className="text-slate-400 mb-6 text-sm">Full governance and alignment for complex organizations.</p>
                 <ul className="space-y-3 mb-8 text-sm flex-1">
                    <li className="flex gap-2 font-medium text-slate-300"><CheckCircle2 className="text-brand-400" size={16}/> Unlimited Global Sessions</li>
                    <li className="flex gap-2 font-medium text-slate-300"><CheckCircle2 className="text-brand-400" size={16}/> Custom SSO & SOC-2 Reporting</li>
                    <li className="flex gap-2 font-medium text-slate-300"><CheckCircle2 className="text-brand-400" size={16}/> Board-Ready Export Engine</li>
                 </ul>
                 <Button variant="outline" className="w-full h-12 border-brand-400 text-brand-400 hover:bg-brand-400 hover:text-slate-900" onClick={onLogin}>Activate Enterprise</Button>
              </div>
           </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-500 py-12 text-sm text-center">
         <div className="max-w-7xl mx-auto px-6">
            <p className="font-bold text-white mb-2 tracking-tighter">VECTOR CLARITY MAPPER</p>
            <p>© {new Date().getFullYear()} Precision Strategy Systems. Enterprise Decision OS.</p>
         </div>
      </footer>
    </div>
  );
};
