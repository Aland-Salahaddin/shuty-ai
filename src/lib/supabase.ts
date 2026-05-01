import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// We use service role key for backend operations to bypass RLS when needed (e.g. syncing users)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
