
import { Users, Target, TrendingUp, LayoutDashboard } from 'lucide-react';

export const PRICING = {
  FREE_MONTHLY_LIMIT: 1,
  PRICE_SUBSCRIPTION: 9.80,
  PRICE_ANNUAL: 198.00,
  SUBSCRIPTION_LIMIT: 20,
};

export const ADMIN_EMAIL = 'admin@vectorclarity.com';
export const ADMIN_PASSWORD = 'vector_admin'; // Demo password

// Replace with your actual Paystack Public Key from your dashboard settings
export const PAYSTACK_PUBLIC_KEY = 'pk_test_8982d09123456789012345678901234567890123'; 

// Supabase Configuration (Required for Enterprise Security)
// Get these from database.new
export const SUPABASE_CONFIG = {
  URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  ANON_KEY: process.env.SUPABASE_KEY || 'your-anon-key-here'
};

export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours

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
  SESSION_DELETED: 'SESSION_DELETED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  EXPORT_DATA: 'DATA_EXPORTED',
  CONSULTANT_APPLICATION: 'CONSULTANT_APP_SUBMITTED'
};

export const NAV_ITEMS = [
  { id: 'setup', label: 'Strategy Setup', icon: Target },
  { id: 'team', label: 'Team Input', icon: Users },
  { id: 'boardroom', label: 'Boardroom', icon: TrendingUp },
];

export const MOCK_ROLES = [
  'Executive Sponsor',
  'Product Manager',
  'Engineering Lead',
  'Sales Director',
  'Marketing Head',
  'Stakeholder'
];

export const SYSTEM_ROLES = [
  { id: 'FACILITATOR', label: 'Facilitator', desc: 'Can edit strategy & manage team' },
  { id: 'CONTRIBUTOR', label: 'Contributor', desc: 'Can vote on initiatives' },
  { id: 'OBSERVER', label: 'Observer', desc: 'Read-only access' },
];
