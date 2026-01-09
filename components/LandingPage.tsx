
import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowRight, CheckCircle2, Target, Zap, Crown, Coffee, Gem, AlertTriangle, Briefcase, GitBranch, Map, Presentation, Info, ShieldCheck, BarChart, Layout, Users, AlertOctagon, PieChart, UserPlus, Layers } from 'lucide-react';
import { PRICING } from '../constants';
import { LegalModal, LegalTab } from './LegalModal';
import { ConsultantApplicationModal } from './ConsultantApplicationModal';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [legalModal, setLegalModal] = useState<{isOpen: boolean, tab: LegalTab}>({
    isOpen: false, 
    tab: 'privacy'
  });
  const [consultantModalOpen, setConsultantModalOpen] = useState(false);

  const openLegal = (tab: LegalTab) => setLegalModal({ isOpen: true, tab });
  const closeLegal = () => setLegalModal({ ...legalModal, isOpen: false });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <LegalModal 
        isOpen={legalModal.isOpen} 
        onClose={closeLegal} 
        initialTab={legalModal.tab} 
      />
      
      <ConsultantApplicationModal 
        isOpen={consultantModalOpen} 
        onClose={() => setConsultantModalOpen(false)} 
      />

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xl tracking-tight">
            <Layout className="text-brand-600" /> VECTOR CLARITY
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-brand-600 font-medium text-sm hidden md:block" onClick={() => document.getElementById('use-cases')?.scrollIntoView({behavior:'smooth'})}>Use Cases</button>
            <button className="text-slate-600 hover:text-brand-600 font-medium text-sm hidden md:block" onClick={() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}>About</button>
            <button className="text-slate-600 hover:text-brand-600 font-medium text-sm hidden md:block" onClick={() => document.getElementById('methodology')?.scrollIntoView({behavior:'smooth'})}>Methodology</button>
            <button className="text-slate-600 hover:text-brand-600 font-medium text-sm hidden md:block" onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Pricing</button>
            <Button variant="ghost" onClick={onLogin}>Login</Button>
            <Button onClick={onLogin}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white pb-20 pt-16 lg:pt-32">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
              <Target size={16} className="text-brand-600" /> The Critical Decision Engine for Teams
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Don't leave strategy <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-400">to chance.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 max-w-2xl mx-auto">
              Vector Clarity Mapper (VCM) is the critical decision-making tool for high-stakes teams. 
              Before you commit resources, pivot, or launch, use VCM to stress-test your initiatives and ensure absolute alignment.
            </p>
            
            <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
               <AlertTriangle size={16} />
               <span className="text-sm font-semibold">"Use it with your team before taking any critical decision."</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg shadow-xl shadow-brand-500/20" onClick={onLogin}>
                Start Mapping Strategy <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}>
                Why VCM?
              </Button>
            </div>
          </div>
        </div>
        
        {/* Abstract Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </header>

      {/* Use Cases Section (Sharp & Clean) */}
      <section id="use-cases" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2">Proven Applications</h2>
                    <h3 className="text-3xl font-bold text-slate-900">Where Clarity Wins</h3>
                </div>
                <p className="text-slate-500 max-w-md text-right hidden md:block">
                    Designed for high-leverage moments where ambiguity is expensive and alignment is non-negotiable.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Use Case 1 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <Briefcase size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Boardroom Decisions</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Break executive deadlocks. Move from subjective debate to objective, data-backed prioritization of capital allocation.
                    </p>
                </div>

                {/* Use Case 2 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <GitBranch size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Agile Execution</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Ensure every sprint ticket connects to the North Star. Filter the backlog by impact vs. feasibility before coding begins.
                    </p>
                </div>

                {/* Use Case 3 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <Map size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Product Roadmaps</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Kill feature creep. Visualize the "Quick Wins" vs "Money Pits" on a 2x2 matrix to defend your roadmap.
                    </p>
                </div>

                {/* Use Case 4 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <Presentation size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Consulting & M&A</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Standardize how you evaluate new ventures, acquisitions, or client strategies with a repeatable scoring framework.
                    </p>
                </div>

                {/* Use Case 5: Emergency Pivot */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                        <AlertOctagon size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Emergency Pivots</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Rapidly realign resources during market shifts. Decide what to cut and what to double down on in hours, not weeks.
                    </p>
                </div>

                {/* Use Case 6: Annual Budgeting */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                        <PieChart size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Annual Budgeting</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Allocate capital based on strategic ROI, not department politics. Visualize the portfolio balance before signing checks.
                    </p>
                </div>

                {/* Use Case 7: Headcount Planning */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                        <UserPlus size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Headcount Planning</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Prioritize hires that actually move the needle. Map open roles against your North Star objectives to justify spend.
                    </p>
                </div>

                {/* Use Case 8: Vendor Selection */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Layers size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Vendor Selection</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Objectively score expensive software or agency partners. Remove emotional bias from the procurement process.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                     <div className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-wider mb-4">
                        <Info size={16} /> The Platform
                     </div>
                     <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Critical Decisions Require Absolute Clarity</h2>
                     <div className="space-y-6 text-slate-600 leading-relaxed">
                         <p>
                             In today's fast-paced market, a misaligned decision can cost millions. <strong>Vector Clarity Mapper (VCM)</strong> isn't just a whiteboard—it's a decision-support system designed to quantify consensus.
                         </p>
                         <p>
                             When your team faces a fork in the road, subjective debates often lead to "Boardroom Deadlock." VCM resolves this by scoring options against your True North.
                         </p>
                         <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-brand-500 my-6">
                            <p className="text-slate-800 font-medium italic mb-2">
                                "We don't launch a project until it passes the VCM check."
                            </p>
                            <p className="text-sm text-slate-500">— Standard Operating Procedure for Agile Teams</p>
                         </div>
                         <p>
                             By combining real-time multi-user voting with an AI-assisted weighted scoring model, we provide an objective "Vector Score" for every initiative. This eliminates recency bias and the Highest Paid Person's Opinion (HiPPO) syndrome.
                         </p>
                         <div className="grid grid-cols-2 gap-4 pt-4">
                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <div className="text-2xl font-bold text-slate-900 mb-1">30%</div>
                                 <div className="text-xs text-slate-500">Faster Decision Making</div>
                             </div>
                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <div className="text-2xl font-bold text-slate-900 mb-1">100%</div>
                                 <div className="text-xs text-slate-500">Alignment on Truth North</div>
                             </div>
                         </div>
                     </div>
                </div>
                <div className="lg:w-1/2">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 group cursor-pointer">
                        <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="text-slate-400 text-xs ml-auto font-mono">LIVE_DECISION_MATRIX.EXE</div>
                        </div>
                        <div className="space-y-4 group-hover:scale-[1.02] transition-transform">
                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-32 bg-slate-800 rounded-lg border border-slate-600 flex items-end justify-around p-4">
                                <div className="w-8 h-16 bg-brand-500 rounded-t relative group-hover:h-20 transition-all duration-700"></div>
                                <div className="w-8 h-24 bg-teal-400 rounded-t relative group-hover:h-28 transition-all duration-500"></div>
                                <div className="w-8 h-10 bg-slate-600 rounded-t relative"></div>
                                <div className="w-8 h-20 bg-brand-400 rounded-t relative group-hover:h-24 transition-all duration-1000"></div>
                            </div>
                            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2">The Methodology</h2>
             <h3 className="text-3xl md:text-4xl font-bold text-slate-900">The 4-Dimensional Vector Score</h3>
             <p className="text-slate-500 mt-4 max-w-2xl mx-auto">We cut through bias by scoring every initiative against four weighted strategic dimensions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
                { icon: Target, title: 'Importance', weight: '35%', desc: 'Does this initiative critically impact our North Star metric?' },
                { icon: ShieldCheck, title: 'Alignment', weight: '30%', desc: 'Is this strictly coherent with our stated Vision and Mission?' },
                { icon: BarChart, title: 'Feasibility', weight: '20%', desc: 'Do we have the technical and human capital to execute this now?' },
                { icon: Zap, title: 'Urgency', weight: '15%', desc: 'What is the cost of delay? Must this happen in the next 90 days?' },
             ].map((item, i) => (
               <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                    <item.icon size={24} />
                 </div>
                 <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                 <div className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded mb-4">Weight: {item.weight}</div>
                 <p className="text-slate-500 leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Flexible Pricing Options</h2>
             <p className="text-slate-500 mt-4">Start free, then subscribe for team impact.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Starter */}
              <div className="p-8 rounded-3xl border border-slate-200 bg-white relative hover:border-brand-200 transition-colors">
                 <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <Coffee size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Free Starter</h3>
                 <div className="text-4xl font-extrabold text-slate-900 mb-6">$0 <span className="text-lg font-medium text-slate-400">/ month</span></div>
                 <p className="text-slate-500 mb-8 min-h-[3rem]">Perfect for trying out the methodology.</p>
                 
                 <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-slate-700"><CheckCircle2 className="text-green-500 shrink-0" /> {PRICING.FREE_MONTHLY_LIMIT} Free Session / Month</li>
                    <li className="flex gap-3 text-slate-700"><CheckCircle2 className="text-green-500 shrink-0" /> Complete Boardroom Access</li>
                    <li className="flex gap-3 text-slate-700"><CheckCircle2 className="text-green-500 shrink-0" /> 1 Export (PDF/CSV)</li>
                    <li className="flex gap-3 text-slate-700"><CheckCircle2 className="text-green-500 shrink-0" /> Expires in 24 hours</li>
                 </ul>
                 
                 <Button variant="outline" className="w-full h-12" onClick={onLogin}>Sign Up Free</Button>
              </div>

              {/* Monthly Pro */}
              <div className="p-8 rounded-3xl border-2 border-brand-500 bg-white text-slate-900 relative shadow-xl transform hover:-translate-y-1 transition-transform duration-300 z-10">
                 <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                 <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-6">
                    <Crown size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Monthly Pro</h3>
                 <div className="text-4xl font-extrabold mb-6">${PRICING.PRICE_SUBSCRIPTION.toFixed(2)} <span className="text-lg font-medium text-slate-400">/ month</span></div>
                 <p className="text-slate-500 mb-8 min-h-[3rem]">For agile teams running weekly or monthly sprints.</p>
                 
                 <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-slate-700"><CheckCircle2 className="text-brand-500 shrink-0" /> Up to {PRICING.SUBSCRIPTION_LIMIT} Sessions / Month</li>
                    <li className="flex gap-3 text-slate-700"><CheckCircle2 className="text-brand-500 shrink-0" /> AI Strategy Assistant</li>
                    <li className="flex gap-3 text-slate-700"><CheckCircle2 className="text-brand-500 shrink-0" /> Unlimited Exports</li>
                 </ul>
                 
                 <Button className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white border-none shadow-lg shadow-brand-900/20" onClick={onLogin}>Subscribe Now</Button>
              </div>

               {/* Annual Expert */}
              <div className="p-8 rounded-3xl border-2 border-purple-500 bg-slate-900 text-white relative shadow-2xl transform hover:-translate-y-1 transition-transform duration-300">
                 <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">EXPERT ACCESS</div>
                 <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center text-purple-400 mb-6">
                    <Gem size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Annual Expert</h3>
                 <div className="text-4xl font-extrabold mb-6">${PRICING.PRICE_ANNUAL.toFixed(0)} <span className="text-lg font-medium text-slate-400">/ year</span></div>
                 <p className="text-slate-400 mb-8 min-h-[3rem]">Maximum impact with expert guidance.</p>
                 
                 <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-slate-200"><CheckCircle2 className="text-purple-400 shrink-0" /> Unlimited Sessions</li>
                    <li className="flex gap-3 text-slate-200"><CheckCircle2 className="text-purple-400 shrink-0" /> 60-min Expert Strategy Call</li>
                    <li className="flex gap-3 text-slate-200"><CheckCircle2 className="text-purple-400 shrink-0" /> Priority 24/7 Support</li>
                 </ul>
                 
                 <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white border-none shadow-lg shadow-purple-900/50" onClick={onLogin}>Get Annual</Button>
              </div>
           </div>
           
           <div className="mt-12 text-center">
              <Button variant="ghost" onClick={() => window.location.href = 'mailto:sales@vectorclarity.com'} className="text-slate-500 hover:text-slate-800">
                  Looking for Enterprise? Contact Sales <ArrowRight size={14} className="ml-1"/>
              </Button>
           </div>
        </div>
      </section>
      
      {/* Partner Section */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-brand-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
               <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-brand-300 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <Briefcase size={12} /> Partner Program
               </div>
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Are you an Agile Facilitator or Strategy Consultant?</h2>
               <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  Join the Vector Clarity Partner Network. Get certified, access white-label reporting tools, and gain exposure to enterprise clients.
               </p>
               <div className="flex gap-4 text-sm text-slate-300 mb-8">
                   <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-500"/> Certified Badge</div>
                   <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-500"/> Revenue Share</div>
                   <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-500"/> Priority Support</div>
               </div>
               <Button onClick={() => setConsultantModalOpen(true)} className="bg-brand-500 hover:bg-brand-600 text-white h-12 px-8">
                  Apply to become a Partner
               </Button>
            </div>
            <div className="md:w-1/3 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                        <Users size={24} className="text-slate-400" />
                    </div>
                    <div>
                        <div className="font-bold">Sarah Jenkins</div>
                        <div className="text-xs text-brand-400 font-bold uppercase">Certified VCM Partner</div>
                    </div>
                </div>
                <p className="text-slate-300 italic text-sm">
                    "Vector Clarity Mapper completely transformed my consulting practice. I used to spend hours collating sticky notes—now I deliver a boardroom-ready PDF instantly."
                </p>
            </div>
         </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
                <Layout className="text-brand-500" /> VECTOR CLARITY
            </div>
            <div className="flex gap-6">
                <button onClick={() => openLegal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                <button onClick={() => openLegal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
                <button onClick={() => openLegal('support')} className="hover:text-white transition-colors">Support</button>
            </div>
            <div>© {new Date().getFullYear()} Vector Toolkit. Enterprise Ready.</div>
         </div>
      </footer>
    </div>
  );
};
