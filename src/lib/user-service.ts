import { supabaseAdmin } from './supabase';
import { SHUTY_CONFIG } from './shuty-config';

export async function getOrCreateProfile(clerkId: string, email?: string) {
  // 1. Try to get existing profile
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (profile) {
    // Check if we need to reset the daily count
    const lastDate = new Date(profile.last_message_date).toDateString();
    const today = new Date().toDateString();

    if (lastDate !== today) {
      // Reset for a new day
      const { data: updated } = await supabaseAdmin
        .from('profiles')
        .update({ messages_sent: 0, last_message_date: new Date().toISOString() })
        .eq('clerk_id', clerkId)
        .select()
        .single();
      return updated;
    }
    return profile;
  }

  // 2. Create new profile if not exists
  if (error || !profile) {
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert({
        clerk_id: clerkId,
        email: email || '',
        plan: 'free',
        messages_sent: 0,
        last_message_date: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      return null;
    }
    return newProfile;
  }

  return null;
}

export async function incrementMessageCount(clerkId: string) {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('messages_sent')
    .eq('clerk_id', clerkId)
    .single();

  if (profile) {
    await supabaseAdmin
      .from('profiles')
      .update({ messages_sent: profile.messages_sent + 1 })
      .eq('clerk_id', clerkId);
  }
}

export function isLimitReached(profile: any) {
  if (!profile) return true;
  const plan = profile.plan.toUpperCase() as 'FREE' | 'PRO';
  const config = SHUTY_CONFIG[plan];
  return profile.messages_sent >= config.maxMessagesPerDay;
}
