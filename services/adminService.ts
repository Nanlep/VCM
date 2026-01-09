
import { AdminStats, AuditLogEntry, ConsultantApplication } from '../types';
import { supabase, isBackendConfigured } from './supabase';
import { AUDIT_EVENTS } from '../constants';

// Mock Data Generators for Demo
const generateMockLogs = (count: number): AuditLogEntry[] => {
  const actions = Object.values(AUDIT_EVENTS);
  const users = ['ceo@acme.com', 'pm@techstart.io', 'sarah@consulting.net', 'admin@vectorclarity.com'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `log_${i}`,
    user_id: users[Math.floor(Math.random() * users.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    metadata: '{}',
    ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockApplications = (): ConsultantApplication[] => [
  { id: 'app_1', full_name: 'Sarah Jenkins', email: 'sarah@consulting.net', linkedin_url: 'linkedin.com/in/sarah', status: 'approved', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'app_2', full_name: 'Mike Ross', email: 'mike@agilecoaches.com', linkedin_url: 'linkedin.com/in/mikeross', status: 'pending', created_at: new Date().toISOString() },
  { id: 'app_3', full_name: 'Jessica Pearson', email: 'jessica@pearson.io', linkedin_url: 'linkedin.com/in/jessica', status: 'rejected', created_at: new Date(Date.now() - 172800000).toISOString() },
];

export const getAdminStats = async (): Promise<AdminStats> => {
  if (isBackendConfigured()) {
    // Real implementation would count rows in Supabase
    // const { count: users } = await supabase.from('users').select('*', { count: 'exact' });
    // return ...
    return {
      totalUsers: 142,
      totalSessions: 389,
      totalRevenue: 12450,
      activeNow: 12,
      complianceScore: 98
    };
  }
  
  // Mock Data
  return {
    totalUsers: 142,
    totalSessions: 389,
    totalRevenue: 12450.00,
    activeNow: Math.floor(Math.random() * 15) + 5,
    complianceScore: 100
  };
};

export const getAuditLogs = async (): Promise<AuditLogEntry[]> => {
  if (isBackendConfigured()) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
      
    if (!error && data) return data as AuditLogEntry[];
  }
  return generateMockLogs(25);
};

export const getConsultantApplications = async (): Promise<ConsultantApplication[]> => {
  if (isBackendConfigured()) {
     const { data, error } = await supabase
        .from('consultant_applications')
        .select('*')
        .order('created_at', { ascending: false });
     if (!error && data) return data as unknown as ConsultantApplication[];
  }
  return generateMockApplications();
};
