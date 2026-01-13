
import React, { useState, useEffect } from 'react';
import { Plus, Layout, Users, Zap, LogOut, BrainCircuit, ChevronRight, Settings, UserCircle, Lock, Clock, AlertTriangle, Trash2, X, RotateCcw, Edit2, Crown, ShieldCheck, UserPlus, Wifi, Shield, Target } from 'lucide-react';
import { Session, ViewState, TeamMember, Initiative, Vote, Score, User, SystemRole } from './types';
import { PRICING, NAV_ITEMS, MOCK_ROLES, SESSION_DURATION_MS, SYSTEM_ROLES, AUDIT_EVENTS, ADMIN_EMAIL, ADMIN_PASSWORD } from './constants';
import { Button } from './components/Button';
import { PricingModal, PricingMode, PlanType } from './components/PricingModal';
import { VotingInterface } from './components/VotingInterface';
import { BoardroomView } from './components/BoardroomView';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { logAuditAction } from './services/auditService';
import { calculateAggregation } from './utils/analytics';

declare const BaniPop: any;

const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vcm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('vcm_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [activeUserId, setActiveUserId] = useState<string>(''); 
  const [pricingModal, setPricingModal] = useState<{
    isOpen: boolean;
    mode: PricingMode;
  }>({ isOpen: false, mode: 'limit' });

  useEffect(() => {
    if (user) localStorage.setItem('vcm_user', JSON.stringify(user));
    else localStorage.removeItem('vcm_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vcm_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const isProUser = (u: User | null) => {
    if (!u?.subscriptionExpiresAt) return false;
    return u.subscriptionExpiresAt > Date.now();
  };

  const handleBaniPayment = (plan: PlanType) => {
    if (!user) return;

    const amount = plan === 'subscription' ? PRICING.PRICE_MONTHLY : PRICING.PRICE_ENTERPRISE;
    
    // Log intent for audit/compliance
    logAuditAction(user.email, AUDIT_EVENTS.PAYMENT_INITIATED, undefined, { plan, amount });

    BaniPop.setup({
      merchantKey: PRICING.BANI_MERCHANT_KEY,
      amount: amount,
      email: user.email,
      phoneNumber: "0000000000",
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || "Lead",
      merchantReference: `VC-${crypto.randomUUID().substring(0,8)}`,
      onClose: () => {
        console.log("Payment window closed");
      },
      callback: (response: any) => {
        if (response.status === 'success') {
          const expiry = plan === 'subscription' ? Date.now() + 30 * 86400000 : Date.now() + 365 * 86400000;
          setUser(prev => prev ? { ...prev, subscriptionExpiresAt: expiry } : null);
          logAuditAction(user.email, AUDIT_EVENTS.PAYMENT_SUCCESS, undefined, { reference: response.reference });
          setPricingModal({ ...pricingModal, isOpen: false });
          alert("Payment Successful! Your Enterprise features are now active.");
        }
      }
    });
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const createNewSession = () => {
    if (!isProUser(user) && sessions.length >= PRICING.FREE_SESSION_LIMIT) {
        setPricingModal({ isOpen: true, mode: 'limit' });
        return;
    }

    const newSession: Session = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
      isPaid: isProUser(user),
      name: `Strategic Session - ${new Date().toLocaleDateString()}`,
      vision: '',
      objectives: [],
      initiatives: [],
      teamMembers: [
          { 
              id: crypto.randomUUID(), 
              name: user?.name || 'Primary Owner', 
              role: 'Strategic Lead',
              systemRole: 'FACILITATOR'
          },
          { 
              id: crypto.randomUUID(), 
              name: 'Team Member 1', 
              role: 'Product Lead',
              systemRole: 'CONTRIBUTOR'
          }
      ],
      votes: []
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
    setActiveUserId(newSession.teamMembers[0].id);
    setCurrentView(ViewState.SESSION_SETUP);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSessionId(null);
    setCurrentView(ViewState.DASHBOARD);
  };

  if (!user) {
    return (
      <>
        <LandingPage onLogin={() => setShowAuth(true)} />
        <AuthModal 
          isOpen={showAuth} 
          onClose={() => setShowAuth(false)} 
          onLogin={(userData) => {
            const newUser = { ...userData, isAdmin: userData.email.toLowerCase() === ADMIN_EMAIL };
            setUser(newUser);
            setShowAuth(false);
          }} 
        />
      </>
    );
  }

  if (currentView === ViewState.DASHBOARD) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between sticky top-0 z-10">
          <div className="font-bold text-slate-900 tracking-tighter flex items-center gap-2">
            <Layout className="text-brand-600" /> VECTOR CLARITY
          </div>
          <div className="flex items-center gap-4">
            {isProUser(user) && <span className="text-xs font-bold bg-brand-600 text-white px-3 py-1 rounded-full flex items-center gap-1"><Crown size={12}/> PRO</span>}
            <button className="text-sm font-medium text-slate-600">{user.name}</button>
            <button onClick={handleLogout} className="text-sm font-medium text-slate-400 hover:text-red-500">Sign Out</button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full p-6 lg:p-10 flex-1">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">My Sessions</h1>
              <p className="text-slate-500">
                {isProUser(user) ? 'Pro Subscription Active' : `Trial Mode: ${sessions.length}/${PRICING.FREE_SESSION_LIMIT} Free Sessions Used`}
              </p>
            </div>
            <Button className="h-12 px-6 gap-2" onClick={createNewSession}>
              <Plus size={20}/> New Session
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(s => (
              <div key={s.id} onClick={() => { setActiveSessionId(s.id); setActiveUserId(s.teamMembers[0].id); setCurrentView(ViewState.SESSION_SETUP); }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                    {s.isPaid ? <ShieldCheck className="text-teal-500" size={16}/> : <Clock className="text-amber-500" size={16}/>}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-700">{s.name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-50">
                    <span className="flex items-center gap-1"><Users size={12}/> {s.teamMembers.length} Members</span>
                    <span className="flex items-center gap-1"><BrainCircuit size={12}/> {s.initiatives.length} Units</span>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <BrainCircuit className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-400 italic">No strategic sessions found.</h3>
                    <Button variant="ghost" className="mt-4" onClick={createNewSession}>Create Your Free Session</Button>
                </div>
            )}
          </div>
        </main>
        <PricingModal 
            isOpen={pricingModal.isOpen} 
            onClose={() => setPricingModal({ ...pricingModal, isOpen: false })} 
            onConfirm={handleBaniPayment}
            mode={pricingModal.mode}
        />
      </div>
    );
  }

  // Session View
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
       <aside className="w-full lg:w-72 bg-slate-900 text-white p-6 flex flex-col h-screen overflow-y-auto">
          <div className="font-black text-brand-400 mb-10 flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(ViewState.DASHBOARD)}>
            <Layout size={20}/> VECTOR CLARITY
          </div>
          
          <nav className="space-y-1 mb-10">
             {NAV_ITEMS.map(n => (
                 <button 
                    key={n.id} 
                    onClick={() => {
                        if(n.id === 'setup') setCurrentView(ViewState.SESSION_SETUP);
                        if(n.id === 'team') setCurrentView(ViewState.VOTING);
                        if(n.id === 'boardroom') setCurrentView(ViewState.BOARDROOM);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        (currentView === ViewState.SESSION_SETUP && n.id === 'setup') ||
                        (currentView === ViewState.VOTING && n.id === 'team') ||
                        (currentView === ViewState.BOARDROOM && n.id === 'boardroom')
                        ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                >
                    <n.icon size={18}/> {n.label}
                 </button>
             ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Simulate Team Activity</div>
             <div className="space-y-2">
                {activeSession?.teamMembers.map(m => (
                    <button 
                        key={m.id}
                        onClick={() => setActiveUserId(m.id)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${activeUserId === m.id ? 'bg-slate-800 ring-1 ring-brand-500' : 'hover:bg-slate-800/50 grayscale opacity-60'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activeUserId === m.id ? 'bg-brand-600' : 'bg-slate-700'}`}>
                            {m.name[0]}
                        </div>
                        <div>
                            <div className="text-xs font-bold">{m.name}</div>
                            <div className="text-[9px] text-slate-400 uppercase tracking-tighter">{m.role}</div>
                        </div>
                        {activeUserId === m.id && <Wifi size={12} className="ml-auto text-brand-400 animate-pulse" />}
                    </button>
                ))}
             </div>
             <button onClick={() => setCurrentView(ViewState.DASHBOARD)} className="mt-8 flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-all">
                <LogOut size={14}/> Exit Session
             </button>
          </div>
       </aside>

       <main className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen bg-slate-50/30">
          {currentView === ViewState.SESSION_SETUP && activeSession && (
              <div className="max-w-4xl animate-in fade-in duration-500">
                 <div className="flex justify-between items-start mb-8">
                    <h2 className="text-4xl font-black text-slate-900">{activeSession.name}</h2>
                    <Button variant="outline" className="gap-2" onClick={() => {}}>
                        <UserPlus size={18}/> Invite Members
                    </Button>
                 </div>

                 <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4 flex items-center gap-2">
                            <Target size={14} className="text-brand-500" /> Strategic Vision Statement
                        </label>
                        <textarea 
                            className="w-full bg-transparent text-2xl font-bold text-slate-800 outline-none placeholder:text-slate-200 resize-none"
                            placeholder="e.g., Become the #1 platform for enterprise alignment by 2026..."
                            rows={3}
                            value={activeSession.vision}
                            onChange={(e) => {
                                setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, vision: e.target.value } : s));
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <Shield size={16} className="text-brand-500" /> Initiatives to Map
                            </h3>
                            <span className="text-xs font-bold text-slate-400">{activeSession.initiatives.length} Units</span>
                        </div>
                        
                        {activeSession.initiatives.map((i, idx) => (
                            <div key={i.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between group shadow-sm">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-lg">{idx + 1}</span>
                                    <div>
                                        <span className="font-bold text-slate-800 block">{i.name}</span>
                                    </div>
                                </div>
                                <button onClick={() => {
                                    setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, initiatives: s.initiatives.filter(init => init.id !== i.id) } : s));
                                }} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><X size={18}/></button>
                            </div>
                        ))}

                        <div className="flex gap-2 mt-4">
                             <input 
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium"
                                placeholder="Add an initiative (e.g., Launch Q3 Mobile App)..."
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        const name = e.currentTarget.value;
                                        if(!name) return;
                                        const newInit = { id: crypto.randomUUID(), name };
                                        setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, initiatives: [...s.initiatives, newInit] } : s));
                                        e.currentTarget.value = '';
                                    }
                                }}
                             />
                        </div>
                    </div>
                 </div>
              </div>
          )}

          {currentView === ViewState.VOTING && activeSession && (
              <VotingInterface 
                initiatives={activeSession.initiatives}
                currentMemberId={activeUserId}
                existingVotes={activeSession.votes}
                onVote={(initId, scores, isAbstain) => {
                    const otherVotes = activeSession.votes.filter(v => !(v.initiativeId === initId && v.memberId === activeUserId));
                    const newVotes = isAbstain || !scores ? otherVotes : [...otherVotes, { initiativeId: initId, memberId: activeUserId, scores, isAbstain: false }];
                    setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, votes: newVotes } : s));
                }}
                teamMembers={activeSession.teamMembers}
                activeMemberIds={[activeUserId]}
                onComplete={() => setCurrentView(ViewState.BOARDROOM)}
                vision={activeSession.vision}
              />
          )}

          {currentView === ViewState.BOARDROOM && activeSession && (
              <BoardroomView 
                session={activeSession}
                results={calculateAggregation(activeSession.initiatives, activeSession.votes)}
                isPro={isProUser(user)}
                onUpgrade={() => setPricingModal({ isOpen: true, mode: 'limit' })}
                onDownload={() => {}}
              />
          )}
       </main>
    </div>
  );
};

export default App;
