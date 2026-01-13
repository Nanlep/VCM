
import { Users, Target, TrendingUp, LayoutDashboard } from 'lucide-react';

export const PRICING = {
  FREE_SESSION_LIMIT: 1, 
  PRO_SESSION_LIMIT: 15, 
  PRICE_MONTHLY: 19.99,
  PRICE_ENTERPRISE: 199.00,
  CURRENCY: 'USD',
  BANI_MERCHANT_KEY: 'pk_test_vector_clarity_dec_os_001', // Replace with live key for prod
};

export const ADMIN_EMAIL = 'admin@vectorclarity.com';
export const ADMIN_PASSWORD = 'vector_admin';

export const SUPABASE_CONFIG = {
  URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  ANON_KEY: process.env.SUPABASE_KEY || 'your-anon-key-here'
};

export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; 

export const SCORING_WEIGHTS = {
  importance: 0.35,
  alignment: 0.30,
  feasibility: 0.20,
  urgency: 0.15,
};

export const AUDIT_EVENTS = {
  LOGIN: 'USER_LOGIN',
  CREATE_SESSION: 'SESSION_CREATED',
  VOTE_SUBMITTED: 'VOTE_SUBMITTED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  EXPORT_DATA: 'DATA_EXPORTED',
  // Added missing audit event to resolve property access error
  CONSULTANT_APPLICATION: 'CONSULTANT_APPLICATION_SUBMITTED',
};

export const NAV_ITEMS = [
  { id: 'setup', label: 'Strategy Setup', icon: Target },
  { id: 'team', label: 'Team Input', icon: Users },
  { id: 'boardroom', label: 'Boardroom', icon: TrendingUp },
];

export const MOCK_ROLES = [
  'Strategic Lead',
  'CEO',
  'CTO',
  'Head of Operations',
  'Lead Investor',
  'Stakeholder'
];

export const SYSTEM_ROLES = [
  { id: 'FACILITATOR', label: 'Facilitator', desc: 'Can edit strategy & manage team' },
  { id: 'CONTRIBUTOR', label: 'Contributor', desc: 'Can vote on initiatives' },
  { id: 'OBSERVER', label: 'Observer', desc: 'Read-only access' },
];