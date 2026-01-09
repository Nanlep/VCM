
import React, { useState, useEffect } from 'react';
import { Vote, Initiative, Score, TeamMember } from '../types';
import { Button } from './Button';
import { Info, CheckCircle, Users, Wifi, PartyPopper, Layout, ArrowRight, SkipForward, Undo2, AlertTriangle, Lightbulb, Target, Shield, Clock, BarChart, Rocket } from 'lucide-react';
import { generateVotingContext } from '../services/geminiService';

interface VotingInterfaceProps {
  initiatives: Initiative[];
  currentMemberId: string;
  existingVotes: Vote[];
  onVote: (initiativeId: string, scores: Score | null, isAbstain: boolean) => void;
  teamMembers: TeamMember[];
  activeMemberIds: string[];
  onComplete: () => void;
  readOnly?: boolean;
  vision?: string;
  objectives?: string[];
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  initiatives,
  currentMemberId,
  existingVotes,
  onVote,
  teamMembers,
  activeMemberIds,
  onComplete,
  readOnly = false,
  vision = '',
  objectives = []
}) => {
  const [activeInitIndex, setActiveInitIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  // AI Tips State
  const [aiTips, setAiTips] = useState<any>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  
  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAbstain, setPendingAbstain] = useState(false);

  const currentInit = initiatives[activeInitIndex];
  const currentVote = existingVotes.find(
    v => v.initiativeId === currentInit?.id && v.memberId === currentMemberId
  );

  // Initialize state based on previous vote or default
  const [tempScores, setTempScores] = useState<Score>(
    currentVote?.scores || { importance: 3, feasibility: 3, urgency: 3, alignment: 3 }
  );

  // Determine if current user is an observer
  const currentUserRole = teamMembers.find(m => m.id === currentMemberId)?.systemRole;
  const isObserver = currentUserRole === 'OBSERVER';

  // Fetch AI Tips when initiative changes
  useEffect(() => {
    if (currentInit && !readOnly) {
        setLoadingTips(true);
        setAiTips(null);
        // Debounce slightly to allow animation to start
        const timer = setTimeout(async () => {
            const tips = await generateVotingContext(
                vision, 
                objectives, 
                currentInit.name, 
                currentInit.description || ''
            );
            setAiTips(tips);
            setLoadingTips(false);
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [currentInit, vision, objectives, readOnly]);

  useEffect(() => {
    // Reset temp scores when initiative changes
    if (currentInit) {
        const v = existingVotes.find(v => v.initiativeId === currentInit.id && v.memberId === currentMemberId);
        setTempScores(v?.scores || { importance: 3, feasibility: 3, urgency: 3, alignment: 3 });
    }
  }, [activeInitIndex, currentInit, existingVotes, currentMemberId]);

  if (!currentInit && !isFinished) return <div className="p-8 text-center text-slate-500">No initiatives to vote on.</div>;

  const handleSliderChange = (key: keyof Score, val: number) => {
    if (readOnly || isObserver) return;
    setTempScores(prev => ({ ...prev, [key]: val }));
  };

  // Triggers the confirmation modal
  const handlePreSubmit = (isAbstain: boolean = false) => {
    if (readOnly || isObserver) {
        // Observers/ReadOnly just navigate, no vote submission needed
        triggerTransition();
        return;
    }
    setPendingAbstain(isAbstain);
    setIsConfirmOpen(true);
  };

  // Finalizes the vote after confirmation
  const confirmSubmit = () => {
    if (!readOnly && !isObserver) {
      onVote(currentInit.id, pendingAbstain ? null : tempScores, pendingAbstain);
    }
    setIsConfirmOpen(false);
    triggerTransition();
  };

  const triggerTransition = () => {
    setAnimating(true);
    setTimeout(() => {
        if (activeInitIndex < initiatives.length - 1) {
            setActiveInitIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
        setAnimating(false);
    }, 300);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10 text-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-brand-100 relative overflow-hidden">
          {/* Confetti Decor */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
          
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <PartyPopper size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Voting Complete!</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            Your strategic inputs have been recorded. The boardroom vector map has been updated in real-time.
          </p>

          <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-200">
             <div className="flex items-center justify-center gap-2 mb-4 text-brand-600 font-bold uppercase tracking-wider text-xs">
                <Rocket size={14} /> Viral Growth
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Want to run a session like this?</h3>
             <p className="text-slate-500 mb-6 text-sm">
                Align your own team or clients with Vector Clarity Mapper. Start for free today.
             </p>
             <div className="flex gap-4 justify-center">
                 <Button onClick={() => window.open('/', '_blank')} variant="outline">Start Free Session</Button>
                 <Button onClick={onComplete} className="gap-2 shadow-lg shadow-brand-500/20">
                    <Layout size={18} /> View Results
                 </Button>
             </div>
          </div>
          
          <div className="text-xs text-slate-400">
             Vector Clarity Mapper • Enterprise Decision Engine
          </div>
        </div>
      </div>
    );
  }

  const renderSlider = (label: string, key: keyof Score, description: string, icon: React.ReactNode, aiTip: string) => (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-brand-200 ${readOnly || isObserver ? 'opacity-60 grayscale-[0.3]' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="text-brand-500">{icon}</div>
                <label className="font-bold text-slate-800 text-lg">
                    {label}
                </label>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[90%]">{description}</p>
        </div>
        <span className={`text-4xl font-black transition-all duration-200 ${
            tempScores[key] >= 4 ? 'text-brand-600' : 
            tempScores[key] <= 2 ? 'text-slate-400' : 'text-brand-400'
        }`}>
            {tempScores[key]}
        </span>
      </div>
      
      <div className="relative h-12 flex items-center mb-4">
        <input 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            disabled={readOnly || isObserver}
            value={tempScores[key]} 
            onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
            className={`w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-500/10 z-10 relative
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-brand-500 
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
            ${readOnly || isObserver ? 'cursor-not-allowed' : ''}
            `}
        />
        {/* Tick marks */}
        <div className="absolute w-full flex justify-between px-2 pointer-events-none top-1/2 -translate-y-1/2">
            {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === tempScores[key] ? 'bg-brand-500' : 'bg-slate-300'}`}></div>)}
        </div>
      </div>
      
      {aiTip && !loadingTips ? (
        <div className="mt-4 bg-brand-50/50 p-3 rounded-lg border border-brand-100 animate-in fade-in">
           <div className="flex items-start gap-2">
              <Lightbulb size={14} className="text-brand-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-brand-800 font-medium italic">"{aiTip}"</p>
           </div>
        </div>
      ) : (
         <div className="mt-4 h-[52px] flex items-center text-xs text-slate-300">
            {loadingTips ? 'Analyzing strategy...' : ''}
         </div>
      )}
    </div>
  );

  const progress = Math.round(((activeInitIndex) / initiatives.length) * 100);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-6 relative">
       {(readOnly || isObserver) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 shadow-sm">
          <Info size={20} />
          <span className="text-sm font-medium">
            {isObserver ? 'You are in Observer Mode. Voting is disabled.' : 'Session is read-only.'}
          </span>
        </div>
      )}

      {/* Header & Presence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-1">
                <span>Initiative {activeInitIndex + 1} of {initiatives.length}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-brand-600">{progress}% Complete</span>
            </div>
            <div className="h-2 w-full md:w-64 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
         </div>

         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-700">{activeMemberIds.length} Active</span>
            <div className="flex -space-x-2 ml-2">
                {teamMembers.filter(m => activeMemberIds.includes(m.id)).slice(0, 4).map(m => (
                    <div key={m.id} className="w-6 h-6 rounded-full bg-brand-100 border border-white flex items-center justify-center text-[10px] font-bold text-brand-700" title={m.name}>
                        {getInitials(m.name)}
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Main Content Card */}
      <div className={`bg-slate-50 rounded-3xl overflow-hidden transition-all duration-300 transform ${animating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
        
        {/* Initiative Header */}
        <div className="bg-white p-8 border-b border-slate-200">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">{currentInit.name}</h1>
            {currentInit.description && (
                <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{currentInit.description}</p>
            )}
        </div>

        {/* Strategic Voting Guide Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {renderSlider(
                "Importance", 
                "importance", 
                "Does this significantly move the needle on our North Star metric?", 
                <Target size={20} />,
                aiTips?.importance
            )}
            {renderSlider(
                "Alignment", 
                "alignment", 
                "Is this strictly coherent with our long-term Vision?", 
                <Shield size={20} />,
                aiTips?.alignment
            )}
            {renderSlider(
                "Feasibility", 
                "feasibility", 
                "Do we have the resources/tech to execute this now?", 
                <BarChart size={20} />,
                aiTips?.feasibility
            )}
            {renderSlider(
                "Urgency", 
                "urgency", 
                "What is the cost of delay? Must this happen immediately?", 
                <Clock size={20} />,
                aiTips?.urgency
            )}
        </div>
        
        {/* Footer Actions */}
        <div className="bg-white p-6 border-t border-slate-200 flex flex-col-reverse md:flex-row justify-between items-center gap-4 sticky bottom-0 z-20">
             <div className="flex gap-3 w-full md:w-auto">
                 <Button 
                   variant="outline" 
                   onClick={() => setActiveInitIndex(prev => Math.max(0, prev - 1))}
                   disabled={activeInitIndex === 0}
                   className="h-12 w-full md:w-auto"
                 >
                   <Undo2 size={18} className="mr-2"/> Back
                 </Button>
                 
                 <Button 
                    variant="ghost" 
                    onClick={() => handlePreSubmit(true)}
                    disabled={readOnly || isObserver}
                    className="h-12 text-slate-400 hover:text-slate-600 w-full md:w-auto"
                    title="Skip without scoring (Abstain)"
                 >
                    <SkipForward size={18} className="mr-2"/> Abstain
                 </Button>
             </div>

             <Button 
                onClick={() => handlePreSubmit(false)} 
                disabled={readOnly || isObserver}
                className="h-12 px-8 text-base gap-2 shadow-xl shadow-brand-500/20 w-full md:w-auto transform transition-transform hover:scale-[1.02]" 
             >
                {activeInitIndex === initiatives.length - 1 ? (
                  <>Finish Voting <CheckCircle size={20}/></>
                ) : (
                  <>Submit & Next <ArrowRight size={20}/></>
                )}
             </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Submission</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {pendingAbstain 
                  ? "Are you sure you want to abstain from voting on this initiative? No score will be recorded." 
                  : "Are you sure you want to submit these scores? You cannot change them after moving to the next initiative."}
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                <Button className="flex-1" onClick={confirmSubmit}>Yes, Submit</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
