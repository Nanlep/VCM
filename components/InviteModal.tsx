
import React, { useState } from 'react';
import { X, Mail, Link as LinkIcon, Copy, Check, Send } from 'lucide-react';
import { Button } from './Button';
import { SYSTEM_ROLES } from '../constants';
import { SystemRole } from '../types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionName: string;
  sessionId: string;
  onInvite: (email: string, role: SystemRole) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, sessionName, sessionId, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SystemRole>('CONTRIBUTOR');
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}?join=${sessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Trigger parent handler
    onInvite(email, role);
    
    // Simulate email sending
    setIsSent(true);
    
    // Construct mailto for actual utility
    const subject = `Join me in strategy session: ${sessionName}`;
    const body = `I'm inviting you to collaborate on our strategic roadmap using Vector Clarity Mapper.\n\nClick here to join: ${inviteLink}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
        setIsSent(false);
        setEmail('');
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Mail className="text-brand-600" size={20} /> Invite Team
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-6 space-y-6">
            {/* Link Section */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Share via Link</label>
                <div className="flex gap-2">
                    <div className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 truncate font-mono">
                        {inviteLink}
                    </div>
                    <Button variant="outline" onClick={handleCopyLink} className="w-24 relative overflow-hidden">
                        {isCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        <span className="ml-2">{isCopied ? 'Copied' : 'Copy'}</span>
                    </Button>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 font-medium">Or send via email</span>
                </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Work Email Address</label>
                    <input 
                        type="email" 
                        required
                        placeholder="colleague@company.com"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Role & Permissions</label>
                    <div className="grid grid-cols-1 gap-2">
                        {SYSTEM_ROLES.map(r => (
                            <div 
                                key={r.id}
                                onClick={() => setRole(r.id as SystemRole)}
                                className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${role === r.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === r.id ? 'border-brand-600' : 'border-slate-400'}`}>
                                    {role === r.id && <div className="w-2 h-2 bg-brand-600 rounded-full" />}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{r.label}</div>
                                    <div className="text-xs text-slate-500">{r.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className={`w-full h-12 text-base transition-all ${isSent ? 'bg-green-600 hover:bg-green-700' : ''}`} 
                    disabled={!email || isSent}
                >
                    {isSent ? (
                        <>
                            <Check size={18} className="mr-2" /> Invite Sent
                        </>
                    ) : (
                        <>
                            <Send size={18} className="mr-2" /> Send Invite
                        </>
                    )}
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
};
