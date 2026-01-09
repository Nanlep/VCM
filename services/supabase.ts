
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../constants';

// Initialize the Supabase client
// Note: This will only work if you have set up a Supabase project and updated constants.ts
export const supabase = createClient(
  SUPABASE_CONFIG.URL,
  SUPABASE_CONFIG.ANON_KEY
);

// Helper to check if backend is configured
export const isBackendConfigured = () => {
    return SUPABASE_CONFIG.URL !== 'https://your-project.supabase.co';
};
