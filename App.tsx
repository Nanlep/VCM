
import React, { useState, useEffect } from 'react';
import { Plus, Layout, Users, Zap, LogOut, BrainCircuit, ChevronRight, Settings, UserCircle, Lock, Clock, AlertTriangle, Trash2, X, RotateCcw, Edit2, Crown, ShieldCheck, UserPlus, Wifi, Shield } from 'lucide-react';
import { Session, ViewState, TeamMember, Initiative, Vote, Score, User, SystemRole } from './types';
import { PRICING, NAV_ITEMS, MOCK_ROLES, SESSION_DURATION_MS, PAYSTACK_PUBLIC_KEY, SYSTEM_ROLES, AUDIT_EVENTS, ADMIN_EMAIL, ADMIN_PASSWORD } from './constants';
import { Button } from './components/Button';
import { PricingModal, PricingMode, PlanType } from './components/PricingModal';
import { VotingInterface } from './components/VotingInterface';
import { BoardroomView } from './components/BoardroomView';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { InviteModal } from './components/InviteModal';
import { ComplianceBanner } from './components/ComplianceBanner';
import { AdminDashboard } from './components/AdminDashboard';
import { calculateAggregation } from './utils/analytics';
import { generateStrategicGuidance } from './services/geminiService';
import { logAuditAction } from './services/auditService';
import { isBackendConfigured } from './services/supabase';

const App = () => {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vcm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuth, setShowAuth] = useState(false);

  // --- App State ---
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('vcm_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Pricing & Modal State
  const [pricingModal, setPricingModal] = useState<{
    isOpen: boolean;
    mode: PricingMode;
    targetSessionId?: string;
  }>({ isOpen: false, mode: 'limit' });

  const [inviteModal, setInviteModal] = useState<{
    isOpen: boolean;
    sessionId: string;
    sessionName: string;
  }>({ isOpen: false, sessionId: '', sessionName: '' });

  // Simulation State (Team Member Selection)
  const [activeUserId, setActiveUserId] = useState<string>(''); 
  
  // Presence State
  const [activeMemberIds, setActiveMemberIds] = useState<string[]>([]);
  
  // Editing State
  const [tempInitName, setTempInitName] = useState('');
  const [tempInitDesc, setTempInitDesc] = useState('');
  const [tempMemberName, setTempMemberName] = useState('');
  const [tempMemberRole, setTempMemberRole] = useState<SystemRole>('CONTRIBUTOR');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- Effects ---
  
  useEffect(() => {
    if (user) localStorage.setItem('vcm_user', JSON.stringify(user));
    else localStorage.removeItem('vcm_user');
  }, [user]);

  // 1. Persist Sessions
  useEffect(() => {
    localStorage.setItem('vcm_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // 2. Sync Sessions across tabs (Real-time simulation)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'vcm_sessions' && e.newValue) {
        const newSessions = JSON.parse(e.newValue);
        setSessions(newSessions);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 3. Join Link Logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinSessionId = params.get('join');

    if (joinSessionId && user) {
      // Find session
      const session = sessions.find(s => s.id === joinSessionId);
      if (session) {
        // Check if user is already a member (by email or name match)
        const existingMember = session.teamMembers.find(m => m.email === user.email || m.name === user.name);
        
        if (!existingMember) {
          // Add user to session automatically
          const newMember: TeamMember = {
            id: crypto.randomUUID(),
            name: user.name,
            email: user.email,
            role: 'Contributor',
            systemRole: 'CONTRIBUTOR'
          };
          const updatedSession = { ...session, teamMembers: [...session.teamMembers, newMember] };
          setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
          setActiveUserId(newMember.id);
          logAuditAction(user.email, 'JOINED_SESSION', session.id);
        } else {
          setActiveUserId(existingMember.id);
        }
        
        setActiveSessionId(session.id);
        setCurrentView(ViewState.SESSION_SETUP);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else if (joinSessionId && !user) {
      // Force login if trying to join
      setShowAuth(true);
    }
  }, [sessions, user]);

  // 4. Presence Heartbeat
  useEffect(() => {
    if (!activeSessionId || !activeUserId) return;
    
    const myKey = `vcm_hb_${activeSessionId}_${activeUserId}`;
    
    const beat = () => localStorage.setItem(myKey, Date.now().toString());
    beat(); 
    const interval = setInterval(beat, 2000);

    return () => {
      clearInterval(interval);
      localStorage.removeItem(myKey); 
    };
  }, [activeSessionId, activeUserId]);

  // 5. Presence Scanner
  useEffect(() => {
    if (!activeSessionId) return;
    
    const scan = () => {
      const prefix = `vcm_hb_${activeSessionId}_`;
      const active: string[] = [];
      const now = Date.now();
      
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
              const ts = parseInt(localStorage.getItem(key) || '0');
              if (now - ts < 5000) { 
                  const uid = key.replace(prefix, '');
                  active.push(uid);
              }
          }
      }
      setActiveMemberIds(active);
    };
    
    const interval = setInterval(scan, 2000);
    scan(); 
    return () => clearInterval(interval);
  }, [activeSessionId]);


  // --- Helpers ---
  const activeSession = sessions.find(s => s.id === activeSessionId);

  const isProUser = (u: User | null) => {
    if (!u?.subscriptionExpiresAt) return false;
    return u.subscriptionExpiresAt > Date.now();
  };

  const isSessionExpired = (session: Session) => {
    if (session.isPaid) return false;
    if (isProUser(user)) return false; // Pro users don't have expiration on sessions
    // Fallback for old sessions without expiresAt
    const expires = session.expiresAt || (session.createdAt + SESSION_DURATION_MS);
    return Date.now() > expires;
  };

  const getTimeRemaining = (session: Session) => {
    if (session.isPaid || isProUser(user)) return 'Unlocked';
    const expires = session.expiresAt || (session.createdAt + SESSION_DURATION_MS);
    const diff = expires - Date.now();
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const createNewSession = () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS, // 24 hours from now
      isPaid: isProUser(user), // Automatically paid if subscription active
      downloadsCount: 0, // Reset download count
      name: `Strategy Session ${new Date().toLocaleDateString()}`,
      vision: '',
      objectives: [],
      initiatives: [],
      teamMembers: [{ 
          id: crypto.randomUUID(), 
          name: user?.name || 'Facilitator', 
          email: user?.email,
          role: 'Executive Sponsor',
          systemRole: 'FACILITATOR'
      }],
      votes: []
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
    setActiveUserId(newSession.teamMembers[0].id);
    setCurrentView(ViewState.SESSION_SETUP);
    if (user) logAuditAction(user.email, AUDIT_EVENTS.CREATE_SESSION, newSession.id);
  };

  // This function runs AFTER payment success
  const completePurchase = (plan: PlanType) => {
    if (plan === 'custom') {
        alert("Please contact sales@vectorclarity.com");
        return;
    }

    if (plan === 'subscription') {
        // Update user to pro for 30 days
        if (user) {
            const updatedUser = { ...user, subscriptionExpiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) };
            setUser(updatedUser);
            // Also unlock all existing sessions for this user context locally
            setSessions(prev => prev.map(s => ({ ...s, isPaid: true })));
        }
        if (pricingModal.mode === 'limit') createNewSession();
    } else if (plan === 'annual') {
        // Update user to pro for 365 days
        if (user) {
            const updatedUser = { ...user, subscriptionExpiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) };
            setUser(updatedUser);
            // Unlock existing sessions
            setSessions(prev => prev.map(s => ({ ...s, isPaid: true })));
            alert("Purchase Successful! You have unlimited access for one year. Our team will email you within 24 hours to schedule your 60-minute expert consultation.");
        }
        if (pricingModal.mode === 'limit') createNewSession();
    }
    if(user) logAuditAction(user.email, AUDIT_EVENTS.PAYMENT_SUCCESS, plan);
    setPricingModal({ ...pricingModal, isOpen: false });
  };

  // Triggers the Paystack Popup
  const initiatePaystackPayment = (plan: PlanType) => {
    if (plan === 'custom') {
        window.location.href = "mailto:sales@vectorclarity.com";
        return;
    }

    if (!user) return;

    let amount = 0;
    if (plan === 'subscription') amount = PRICING.PRICE_SUBSCRIPTION;
    else if (plan === 'annual') amount = PRICING.PRICE_ANNUAL;
    else return; // Invalid plan type

    // @ts-ignore - Paystack is loaded via CDN in index.html
    const paystack = new PaystackPop();
    
    paystack.newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: amount * 100, // Paystack expects amount in kobo/cents
      currency: 'USD', // Assumes your Paystack account can handle USD. Defaults to NGN if not specified.
      onSuccess: (transaction: any) => {
        // console.log(transaction);
        completePurchase(plan);
      },
      onCancel: () => {
        // console.log('User closed modal');
      }
    });
  };

  const handleCreateSessionClick = () => {
    if (isProUser(user)) {
        if (sessions.length >= PRICING.SUBSCRIPTION_LIMIT) {
            setPricingModal({ isOpen: true, mode: 'limit' });
            return;
        }
        createNewSession();
    } else {
        // Free Tier Logic: Check if created >= FREE_MONTHLY_LIMIT this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const sessionsCreatedThisMonth = sessions.filter(s => s.createdAt >= startOfMonth).length;
        
        if (sessionsCreatedThisMonth >= PRICING.FREE_MONTHLY_LIMIT) {
            setPricingModal({ isOpen: true, mode: 'limit' });
            return;
        }
        createNewSession();
    }
  };

  const updateSession = (id: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSessionClick = (session: Session) => {
    setActiveSessionId(session.id);
    // Find current user in team, or default to first
    const me = session.teamMembers.find(m => m.email === user?.email) || session.teamMembers[0];
    setActiveUserId(me?.id || '');
    setCurrentView(ViewState.SESSION_SETUP);
  };

  const handleDownloadIncrement = () => {
    if (activeSession) {
      updateSession(activeSession.id, { downloadsCount: (activeSession.downloadsCount || 0) + 1 });
      if (user) logAuditAction(user.email, AUDIT_EVENTS.EXPORT_DATA, activeSession.id);
    }
  };

  // --- Handlers ---

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setCurrentView(ViewState.DASHBOARD);
      }
      if (user) logAuditAction(user.email, AUDIT_EVENTS.SESSION_DELETED, sessionId);
    }
  };

  const addInitiative = () => {
    if (!activeSession || !tempInitName.trim()) return;
    const newItem: Initiative = { 
      id: crypto.randomUUID(), 
      name: tempInitName,
      description: tempInitDesc
    };
    updateSession(activeSession.id, { initiatives: [...activeSession.initiatives, newItem] });
    setTempInitName('');
    setTempInitDesc('');
  };

  const addMember = () => {
    if (!activeSession || !tempMemberName.trim()) return;
    const newMember: TeamMember = { 
      id: crypto.randomUUID(), 
      name: tempMemberName, 
      role: MOCK_ROLES[Math.floor(Math.random() * MOCK_ROLES.length)],
      systemRole: tempMemberRole
    };
    updateSession(activeSession.id, { teamMembers: [...activeSession.teamMembers, newMember] });
    setTempMemberName('');
  };

  const inviteMember = (email: string, role: SystemRole) => {
      if (!activeSession) return;
      
      // Check if email exists
      if (activeSession.teamMembers.some(m => m.email === email)) return;

      // Add placeholder member for the invite
      const newMember: TeamMember = { 
        id: crypto.randomUUID(), 
        name: email.split('@')[0], 
        email: email,
        role: 'Invited Member',
        systemRole: role
      };
      updateSession(activeSession.id, { teamMembers: [...activeSession.teamMembers, newMember] });
  };

  const removeMember = (memberId: string) => {
    if (!activeSession) return;
    if (activeSession.teamMembers.length <= 1) {
      alert("You must have at least one team member.");
      return;
    }
    const updatedMembers = activeSession.teamMembers.filter(m => m.id !== memberId);
    updateSession(activeSession.id, { teamMembers: updatedMembers });
    if (activeUserId === memberId) {
      setActiveUserId(updatedMembers[0].id);
    }
  };

  const handleVote = (initId: string, scores: Score | null, isAbstain: boolean) => {
    if (!activeSession) return;
    // Remove previous vote for this initiative by this user
    const otherVotes = activeSession.votes.filter(v => !(v.initiativeId === initId && v.memberId === activeUserId));
    
    // Only add vote if not abstaining (or track abstention if needed, for now just don't add score)
    if (!isAbstain && scores) {
        const newVote: Vote = { initiativeId: initId, memberId: activeUserId, scores, isAbstain: false };
        updateSession(activeSession.id, { votes: [...otherVotes, newVote] });
    } else {
        // Explicitly remove vote (abstaining clears previous vote)
        updateSession(activeSession.id, { votes: otherVotes });
    }
    // Log a fraction of votes to avoid spamming audit log, or log the batch completion
    if(user && activeSession.initiatives[activeSession.initiatives.length-1].id === initId) {
        logAuditAction(user.email, AUDIT_EVENTS.VOTE_SUBMITTED, activeSession.id, { initiativeCount: activeSession.initiatives.length });
    }
  };

  const handleAiGenerate = async () => {
    if (!activeSession?.vision) return;
    setIsAiLoading(true);
    try {
      const res = await generateStrategicGuidance(activeSession.vision, activeSession.objectives);
      if (res.suggestedInitiatives) {
        const newInits = res.suggestedInitiatives.map((name: string) => ({
          id: crypto.randomUUID(),
          name,
          description: ''
        }));
        updateSession(activeSession.id, { 
          initiatives: [...activeSession.initiatives, ...newInits] 
        });
      }
    } catch (e) {
      alert('AI Generation failed. Check API Key in env.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSessionId(null);
  };

  const handleEditProfile = () => {
    setShowAuth(true);
  };

  const handleResetApp = () => {
    if (confirm('WARNING: This will wipe all local data, including sessions and user profile. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- View Rendering ---

  if (!user) {
    return (
      <>
        <LandingPage onLogin={() => setShowAuth(true)} />
        <AuthModal 
          isOpen={showAuth} 
          onClose={() => setShowAuth(false)} 
          onLogin={(userData, password) => {
            // Check if admin
            const isEmailAdmin = userData.email.toLowerCase() === ADMIN_EMAIL;
            
            if (isEmailAdmin) {
                if (password === ADMIN_PASSWORD) {
                    const newUser = { ...userData, isAdmin: true };
                    setUser(newUser);
                    setShowAuth(false);
                    logAuditAction(userData.email, AUDIT_EVENTS.LOGIN);
                } else {
                    alert("Invalid Admin Password");
                }
            } else {
                // Regular User Login (No password check for demo)
                const newUser = { ...userData, isAdmin: false };
                setUser(newUser);
                setShowAuth(false);
                logAuditAction(userData.email, AUDIT_EVENTS.LOGIN);
            }
          }} 
        />
        <ComplianceBanner />
      </>
    );
  }

  // Handle Admin View
  if (currentView === ViewState.ADMIN && user.isAdmin) {
      return (
        <AdminDashboard 
            onExit={() => setCurrentView(ViewState.DASHBOARD)} 
            onLogout={handleLogout}
        />
      );
  }

  const isSecure = isBackendConfigured();

  if (currentView === ViewState.DASHBOARD) {
    const targetSession = sessions.find(s => s.id === pricingModal.targetSessionId);

    return (
      <div className="min-h-screen bg-slate-50">
        <ComplianceBanner />
        <PricingModal 
          isOpen={pricingModal.isOpen} 
          onClose={() => setPricingModal({ ...pricingModal, isOpen: false })} 
          onConfirm={initiatePaystackPayment}
          mode={pricingModal.mode}
          sessionName={targetSession?.name}
        />
        
        <AuthModal 
          isOpen={showAuth} 
          onClose={() => setShowAuth(false)} 
          onLogin={(userData, password) => {
             // For profile editing/re-login from Dashboard
             setUser({ ...userData, isAdmin: user.isAdmin }); // Preserve admin status if editing profile
             setShowAuth(false);
          }} 
        />

        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-lg tracking-tight">
              <Layout className="text-brand-600" /> VECTOR CLARITY MAPPER
            </div>
            <div className="flex items-center gap-4">
              {isSecure ? (
                <span title="Encrypted Cloud Storage Active" className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase text-teal-600 bg-teal-50 border border-teal-200 px-2 py-1 rounded-full">
                  <ShieldCheck size={12} /> Secure
                </span>
              ) : (
                <span title="Local Demo Mode (Data in Browser)" className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">
                  <Wifi size={12} className="text-slate-400" /> Local
                </span>
              )}
              {isProUser(user) && (
                <span className="flex items-center gap-1 text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md border border-brand-100">
                   <Crown size={12} fill="currentColor" /> PRO ACTIVE
                </span>
              )}

              {/* Admin Button */}
              {user.isAdmin && (
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => setCurrentView(ViewState.ADMIN)}
                    className="shadow-md shadow-red-500/20"
                  >
                      <Shield size={14} className="mr-1" /> Admin Console
                  </Button>
              )}

              <button onClick={handleEditProfile} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
                <UserCircle size={16} />
                {user.name}
              </button>
              <button onClick={handleLogout} className="text-slate-400 hover:text-slate-700 text-sm font-medium">Sign Out</button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 lg:p-10 pb-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
             <div>
               <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Strategy Sessions</h1>
               <p className="text-slate-500">Manage your strategic initiatives and boardroom visualizations.</p>
             </div>
             <Button className="gap-2 shadow-lg shadow-brand-500/20" onClick={handleCreateSessionClick}>
                <Plus size={18}/> New Session
             </Button>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BrainCircuit className="text-slate-300" size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">No sessions found</h3>
               <p className="text-slate-500 mb-6">Start a new session to begin mapping your strategic vector.</p>
               <Button variant="outline" onClick={handleCreateSessionClick}>Create First Session</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(session => {
                const expired = isSessionExpired(session);
                const timeLeft = getTimeRemaining(session);
                const locked = expired && !session.isPaid && !isProUser(user);

                return (
                  <div key={session.id} 
                    className={`bg-white p-6 rounded-xl shadow-sm border transition-all group relative overflow-hidden ${locked ? 'border-red-100 bg-red-50/30 cursor-not-allowed' : 'border-slate-200 hover:border-brand-400 hover:shadow-md cursor-pointer'}`} 
                    onClick={() => handleSessionClick(session)}
                  >
                    {locked ? (
                       <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 p-6 text-center">
                          <div className="bg-red-100 p-3 rounded-full text-red-500 mb-3">
                            <Lock size={24} />
                          </div>
                          <h4 className="text-slate-900 font-bold mb-1">Session Expired</h4>
                          <p className="text-xs text-slate-500 mb-4">Unlock to access data</p>
                          <Button size="sm" className="w-full bg-slate-900" onClick={(e) => { e.stopPropagation(); setPricingModal({isOpen: true, mode: 'expired', targetSessionId: session.id}); }}>Unlock Access</Button>
                       </div>
                    ) : (
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight className="text-brand-500" />
                      </div>
                    )}

                    <div className="mb-4 pr-8">
                       <div className="flex justify-between items-start mb-2">
                          <span className="inline-block px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs font-medium">
                              {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${session.isPaid || isProUser(user) ? 'text-brand-600' : expired ? 'text-red-500' : 'text-amber-500'}`}>
                             {session.isPaid || isProUser(user) ? <Zap size={10} /> : <Clock size={10} />}
                             {timeLeft}
                          </span>
                       </div>
                       <h3 className="font-bold text-lg text-slate-800 group-hover:text-brand-700 transition-colors mb-1 truncate">
                         {session.name}
                       </h3>
                       <p className="text-sm text-slate-400 truncate">
                         {session.vision || "No vision statement defined yet."}
                       </p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                           <div className="flex items-center gap-1">
                              <Layout size={14} /> {session.initiatives.length}
                           </div>
                           <div className="flex items-center gap-1">
                              <Users size={14} /> {session.teamMembers.length}
                           </div>
                        </div>
                        <button 
                            onClick={(e) => deleteSession(e, session.id)} 
                            className="text-slate-300 hover:text-red-500 transition-colors z-30 p-1"
                            title="Delete Session"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
                <span>Plan: {isProUser(user) ? 'Pro Subscription' : 'Free Starter'}</span>
                <span>•</span>
                <span>{sessions.length} / {isProUser(user) ? PRICING.SUBSCRIPTION_LIMIT : 'Unlimited (Total)'} Sessions Stored</span>
            </div>
            {!isProUser(user) && <p>You get {PRICING.FREE_MONTHLY_LIMIT} free session per month. Sessions expire after 24h unless unlocked.</p>}
            <button onClick={handleResetApp} className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors mt-4 px-4 py-2 rounded border border-transparent hover:border-red-200">
                <RotateCcw size={12} /> Reset Demo App
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeSession) return null;

  const aggregatedResults = calculateAggregation(activeSession.initiatives, activeSession.votes);
  const isLocked = isSessionExpired(activeSession);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <aside className="w-full lg:w-64 bg-slate-900 text-white p-6 flex flex-col flex-shrink-0">
        <div className="mb-8 flex items-center gap-2 font-bold tracking-wider text-brand-400 cursor-pointer" onClick={() => {
            setCurrentView(ViewState.DASHBOARD);
            setActiveSessionId(null);
        }}>
          <Layout size={20} /> VECTOR
        </div>
        
        <div className="space-y-2 flex-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'setup') setCurrentView(ViewState.SESSION_SETUP);
                if (item.id === 'team') setCurrentView(ViewState.VOTING);
                if (item.id === 'boardroom') setCurrentView(ViewState.BOARDROOM);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                (currentView === ViewState.SESSION_SETUP && item.id === 'setup') ||
                (currentView === ViewState.VOTING && item.id === 'team') ||
                (currentView === ViewState.BOARDROOM && item.id === 'boardroom')
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50 translate-x-1' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          {activeSession.isPaid || isProUser(user) ? (
             <div className="mb-6 bg-brand-900/50 rounded-lg p-3 border border-brand-500/30">
                 <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase mb-1">
                    <Zap size={12} /> Pro Unlocked
                 </div>
                 <p className="text-xs text-slate-400">This session does not expire.</p>
             </div>
          ) : (
            <div className="mb-6 bg-slate-800 rounded-lg p-3 border border-slate-700">
                 <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                    <Clock size={12} /> Expires in 24h
                 </div>
                 <Button size="sm" className="w-full text-xs h-7 mt-2" onClick={() => setPricingModal({isOpen: true, mode: 'expired', targetSessionId: activeSession.id})}>
                    Unlock Forever
                 </Button>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4 text-slate-500 text-xs font-medium uppercase">
             <Settings size={12} /> Simulation Tools
          </div>
          <div className="text-xs text-slate-500 uppercase mb-2 font-semibold">View As (Role)</div>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm mb-4 outline-none focus:border-brand-500 text-slate-300"
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
          >
            {activeSession.teamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.systemRole.charAt(0) + m.systemRole.slice(1).toLowerCase()})</option>
            ))}
          </select>
          <button 
            onClick={() => {
              setCurrentView(ViewState.DASHBOARD);
              setActiveSessionId(null);
            }}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors w-full px-2 py-2 rounded hover:bg-slate-800"
          >
            <LogOut size={14} /> Return to Sessions
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen">
        <ComplianceBanner />
        <PricingModal 
          isOpen={pricingModal.isOpen} 
          onClose={() => setPricingModal({ ...pricingModal, isOpen: false })} 
          onConfirm={initiatePaystackPayment}
          mode={pricingModal.mode}
          sessionName={activeSession.name}
        />

        <InviteModal
            isOpen={inviteModal.isOpen}
            onClose={() => setInviteModal({ ...inviteModal, isOpen: false })}
            sessionName={inviteModal.sessionName}
            sessionId={inviteModal.sessionId}
            onInvite={inviteMember}
        />
        
        {isLocked && (
          <div className="bg-red-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
               <Lock size={20} />
               <span className="font-bold">Session Expired (Read Only)</span>
            </div>
            <Button size="sm" variant="secondary" className="text-red-600 bg-white hover:bg-red-50" onClick={() => setPricingModal({isOpen: true, mode: 'expired', targetSessionId: activeSession.id})}>Unlock Editing</Button>
          </div>
        )}

        <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
           <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-bold text-slate-800">{activeSession.name}</h2>
                 <button 
                    disabled={isLocked}
                    onClick={() => {
                        const newName = prompt("Rename Session:", activeSession.name);
                        if(newName) updateSession(activeSession.id, { name: newName });
                    }}
                    className="text-slate-400 hover:text-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <Edit2 size={16} />
                 </button>
              </div>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <span className={`inline-block w-2 h-2 rounded-full ${activeMemberIds.length > 1 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                {
                  currentView === ViewState.SESSION_SETUP ? 'Define True North and Initiatives' :
                  currentView === ViewState.VOTING ? 'Team Consensus Scoring' :
                  'Executive Boardroom Analytics'
                }
              </p>
           </div>
        </header>

        {currentView === ViewState.SESSION_SETUP && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2"><Zap size={18} className="text-brand-500"/> Vision & Objectives</h3>
                  <Button variant="ghost" size="sm" onClick={handleAiGenerate} disabled={isAiLoading || isLocked} className="text-brand-600 bg-brand-50 hover:bg-brand-100">
                    {isAiLoading ? 'Analyzing...' : '✨ AI Optimization'}
                  </Button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Vision Statement (True North)</label>
                    <textarea 
                      disabled={isLocked}
                      className="w-full p-5 border border-slate-200 rounded-xl bg-white shadow-sm focus:shadow-md focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-slate-800 text-xl font-bold placeholder:text-slate-300 placeholder:font-normal transition-all disabled:bg-slate-50 disabled:text-slate-400 resize-none leading-relaxed"
                      rows={3}
                      placeholder="e.g. Become the #1 provider of widget analytics by 2026..."
                      value={activeSession.vision}
                      onChange={(e) => updateSession(activeSession.id, { vision: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Key Strategic Objectives</label>
                    <textarea 
                       disabled={isLocked}
                       className="w-full p-5 border border-slate-200 rounded-xl bg-white shadow-sm focus:shadow-md focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-slate-800 text-lg font-medium placeholder:text-slate-300 placeholder:font-normal transition-all disabled:bg-slate-50 disabled:text-slate-400 resize-none leading-relaxed"
                       rows={5}
                       placeholder="• Increase ARR by 30%&#10;• Reduce Churn to <5%&#10;• Launch in APAC market"
                       value={activeSession.objectives.join('\n')}
                       onChange={(e) => updateSession(activeSession.id, { objectives: e.target.value.split('\n') })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><Users size={18} className="text-brand-500"/> Team Participants</h3>
                    {!isLocked && (
                        <Button size="sm" variant="secondary" onClick={() => setInviteModal({ isOpen: true, sessionId: activeSession.id, sessionName: activeSession.name })} className="gap-2 text-xs">
                            <UserPlus size={14} /> Invite via Email
                        </Button>
                    )}
                 </div>
                 
                 <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                        <div className="col-span-2">
                            <input 
                              type="text" 
                              disabled={isLocked}
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 bg-white shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50 transition-all"
                              placeholder="New team member name..."
                              value={tempMemberName}
                              onChange={(e) => setTempMemberName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addMember()}
                            />
                        </div>
                        <div>
                             <select 
                                disabled={isLocked}
                                value={tempMemberRole}
                                onChange={(e) => setTempMemberRole(e.target.value as SystemRole)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 bg-white shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50 transition-all cursor-pointer"
                             >
                                {SYSTEM_ROLES.map(role => (
                                    <option key={role.id} value={role.id}>{role.label}</option>
                                ))}
                             </select>
                        </div>
                    </div>
                    <Button size="sm" onClick={addMember} disabled={!tempMemberName || isLocked} className="w-full h-10 rounded-lg">Add Participant</Button>
                 </div>

                 <div className="flex flex-col gap-2">
                   {activeSession.teamMembers.map(m => (
                     <div key={m.id} className="group flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                       <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.systemRole === 'FACILITATOR' ? 'bg-purple-100 text-purple-600' : m.systemRole === 'OBSERVER' ? 'bg-slate-100 text-slate-500' : 'bg-brand-100 text-brand-600'}`}>
                                {m.name.charAt(0)}
                           </div>
                           <div>
                               <div className="text-sm font-medium text-slate-800">{m.name}</div>
                               <div className="text-xs text-slate-500 flex gap-2">
                                    {m.email && <span className="text-brand-600 font-medium">{m.email}</span>}
                                    {m.email && <span className="text-slate-300">•</span>}
                                    <span className="uppercase text-[10px] font-bold tracking-wider text-slate-400">{m.systemRole}</span>
                               </div>
                           </div>
                       </div>
                       {activeSession.teamMembers.length > 1 && !isLocked && (
                         <button onClick={() => removeMember(m.id)} className="text-slate-300 hover:text-red-500 transition-all p-2">
                            <X size={16} />
                         </button>
                       )}
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-200px)] sticky top-6">
               <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><BrainCircuit size={18} className="text-brand-500"/> Strategic Initiatives</h3>
               
               {!isLocked && (
                   <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-xl px-5 py-4 text-lg font-bold text-slate-800 bg-white shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300 transition-all"
                        placeholder="Initiative Name (e.g. Project Alpha)"
                        value={tempInitName}
                        onChange={(e) => setTempInitName(e.target.value)}
                      />
                      <textarea
                        className="w-full border border-slate-200 rounded-xl px-5 py-3 text-sm text-slate-600 bg-white shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300 resize-none transition-all mt-3"
                        placeholder="Brief Description (optional)..."
                        rows={2}
                        value={tempInitDesc}
                        onChange={(e) => setTempInitDesc(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addInitiative();
                            }
                        }}
                      />
                      <Button onClick={addInitiative} disabled={!tempInitName} className="w-full mt-3 h-12 rounded-xl shadow-md shadow-brand-500/20">Add Initiative</Button>
                   </div>
               )}
               
               <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                 {activeSession.initiatives.length === 0 && (
                   <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                     <BrainCircuit className="mx-auto mb-2 opacity-20" size={40} />
                     No initiatives yet.<br/> Add manually or use AI Optimization.
                   </div>
                 )}
                 {activeSession.initiatives.map((init, idx) => (
                   <div key={init.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm group hover:border-brand-300 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 w-full">
                            <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full text-xs font-bold">{idx + 1}</span>
                            <input
                                disabled={isLocked}
                                className="w-full font-bold text-lg text-slate-800 border-none p-0 focus:ring-0 bg-transparent focus:text-brand-700 transition-colors disabled:text-slate-500 placeholder-slate-300"
                                value={init.name}
                                onChange={(e) => {
                                    const updated = activeSession.initiatives.map(i => i.id === init.id ? {...i, name: e.target.value} : i);
                                    updateSession(activeSession.id, { initiatives: updated });
                                }}
                            />
                        </div>
                        {!isLocked && (
                            <button 
                                onClick={() => {
                                    const newInits = activeSession.initiatives.filter(i => i.id !== init.id);
                                    updateSession(activeSession.id, { initiatives: newInits });
                                }}
                                className="text-slate-300 hover:text-red-500 transition-colors ml-2 opacity-0 group-hover:opacity-100"
                            >
                                <LogOut size={14} className="rotate-180"/> 
                            </button>
                        )}
                      </div>
                      <div className="pl-9 mt-2">
                        <textarea
                            disabled={isLocked}
                            className="w-full text-sm text-slate-600 bg-slate-50 border-none rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-brand-100 resize-none transition-colors disabled:text-slate-400"
                            placeholder="Add description..."
                            rows={2}
                            value={init.description || ''}
                            onChange={(e) => {
                                const updated = activeSession.initiatives.map(i => i.id === init.id ? {...i, description: e.target.value} : i);
                                updateSession(activeSession.id, { initiatives: updated });
                            }}
                        />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {currentView === ViewState.VOTING && (
          <div className="animate-in fade-in duration-500">
             <VotingInterface 
                initiatives={activeSession.initiatives}
                currentMemberId={activeUserId}
                existingVotes={activeSession.votes}
                onVote={handleVote}
                teamMembers={activeSession.teamMembers}
                activeMemberIds={activeMemberIds}
                onComplete={() => setCurrentView(ViewState.DASHBOARD)}
                readOnly={isLocked}
                vision={activeSession.vision}
                objectives={activeSession.objectives}
            />
          </div>
        )}

        {currentView === ViewState.BOARDROOM && (
          <BoardroomView 
            session={activeSession} 
            results={aggregatedResults} 
            isPro={isProUser(user)}
            onUpgrade={() => setPricingModal({ isOpen: true, mode: 'limit' })}
            onDownload={handleDownloadIncrement}
          />
        )}

      </main>
    </div>
  );
};

export default App;
