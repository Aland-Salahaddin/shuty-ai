import { d1Query } from './d1';
import { SHUTY_CONFIG } from './shuty-config';

export async function getOrCreateProfile(clerkId: string, email?: string) {
  try {
    // 1. Try to get existing profile
    const result = await d1Query(
      `SELECT * FROM profiles WHERE clerk_id = ? LIMIT 1`,
      [clerkId]
    );

    const profile = result.results?.[0] as any;

    if (profile) {
      return profile;
    }

    // 2. Create new profile if not exists
    await d1Query(
      `INSERT INTO profiles (clerk_id, email, plan, points) VALUES (?, ?, ?, ?)`,
      [clerkId, email || '', 'FREE', 0]
    );

    const newResult = await d1Query(
      `SELECT * FROM profiles WHERE clerk_id = ? LIMIT 1`,
      [clerkId]
    );

    return newResult.results?.[0];
  } catch (error) {
    console.error('getOrCreateProfile Error:', error);
    return null;
  }
}

export async function incrementMessageCount(clerkId: string) {
  // We handle message count via Clerk metadata now for speed, 
  // but we can also log it in D1 for analytics.
  try {
    await d1Query(
      `UPDATE profiles SET points = points + 1 WHERE clerk_id = ?`,
      [clerkId]
    );
  } catch (error) {
    console.error('incrementMessageCount Error:', error);
  }
}

export async function updateProfilePoints(clerkId: string, points: number) {
  try {
    await d1Query(
      `UPDATE profiles SET points = ? WHERE clerk_id = ?`,
      [points, clerkId]
    );
  } catch (error) {
    console.error('updateProfilePoints Error:', error);
  }
}

export function isLimitReached(profile: any) {
  // This is handled in the route now using Clerk metadata for real-time accuracy
  return false;
}
