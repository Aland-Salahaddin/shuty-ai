import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Safety check to prevent app crash if keys are missing
const isClientConfigured = supabaseUrl && supabaseAnonKey;
const isAdminConfigured = supabaseUrl && supabaseServiceKey;

// Client-safe instance (for Support Chat)
// We only initialize if keys exist to prevent "supabaseKey is required" error
export const supabase = isClientConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (null as any); 

// Admin-only instance (for background tasks)
export const supabaseAdmin = isAdminConfigured
  ? createClient(supabaseUrl, supabaseServiceKey)
  : (null as any);

if (!isClientConfigured) {
  console.warn('Supabase: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Support chat will be disabled.');
}
