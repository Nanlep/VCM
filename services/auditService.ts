
import { supabase, isBackendConfigured } from './supabase';

// Structured log format for compliance
export const logAuditAction = async (
  userId: string, 
  action: string, 
  resourceId?: string, 
  metadata: any = {}
) => {
  const logEntry = {
    user_id: userId,
    action,
    resource_id: resourceId,
    metadata: JSON.stringify(metadata),
    timestamp: new Date().toISOString(),
    ip_address: 'client-side-simulated' // In a real app, this is captured server-side
  };

  console.log('🔒 AUDIT LOG:', logEntry);

  if (isBackendConfigured()) {
    try {
        await supabase.from('audit_logs').insert([logEntry]);
    } catch (error) {
        console.error('Failed to push audit log to cloud:', error);
    }
  }
};
