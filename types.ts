
export interface Score {
  importance: number; // 1-5
  feasibility: number; // 1-5
  urgency: number; // 1-5
  alignment: number; // 1-5
}

export interface Initiative {
  id: string;
  session_id?: string; // DB Foreign Key
  name: string;
  description?: string;
  created_at?: string;
}

export type SystemRole = 'FACILITATOR' | 'CONTRIBUTOR' | 'OBSERVER';

export interface TeamMember {
  id: string; // This maps to session_members.id
  user_id?: string; // This maps to auth.users.id
  name: string;
  email?: string; 
  role: string; // Job Title
  systemRole: SystemRole;
  is_active?: boolean; // For presence UI
}

export interface Vote {
  id?: string;
  initiativeId: string;
  memberId: string; // session_member.id
  scores: Score;
  isAbstain?: boolean;
}

export interface Session {
  id: string;
  owner_id?: string;
  createdAt: number; // Mapped from DB created_at string
  expiresAt: number;
  isPaid: boolean;
  downloadsCount?: number;
  name: string;
  vision: string;
  objectives: string[];
  initiatives: Initiative[];
  teamMembers: TeamMember[];
  votes: Vote[];
}

export type AggregatedResult = {
  initiativeId: string;
  name: string;
  avgImportance: number;
  avgFeasibility: number;
  avgUrgency: number;
  avgAlignment: number;
  vectorScore: number;
  voteCount: number;
};

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SESSION_SETUP = 'SESSION_SETUP',
  VOTING = 'VOTING',
  BOARDROOM = 'BOARDROOM',
  ADMIN = 'ADMIN',
}

export interface User {
  id?: string; // Auth ID
  name: string;
  email: string;
  subscriptionExpiresAt?: number;
  isAdmin?: boolean;
}

// Admin Specific Types
export interface AdminStats {
  totalUsers: number;
  totalSessions: number;
  totalRevenue: number;
  activeNow: number;
  complianceScore: number;
}

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  metadata: string;
  ip_address: string;
}

export interface ConsultantApplication {
  id: string;
  full_name: string;
  email: string;
  linkedin_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
