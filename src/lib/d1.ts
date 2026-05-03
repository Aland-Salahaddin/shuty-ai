/**
 * Cloudflare D1 REST API client.
 */

const CF_API = 'https://api.cloudflare.com/client/v4'
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ''
const DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || ''
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || ''

if (!ACCOUNT_ID || !DB_ID || !TOKEN) {
  console.warn('Cloudflare D1 environment variables are missing! AI Chat persistence will fail.');
}

interface D1Result<T = Record<string, unknown>> {
  results: T[]
  success: boolean
  errors: { message: string }[]
}

export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | null)[] = []
): Promise<D1Result<T>> {
  const res = await fetch(
    `${CF_API}/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
    }
  )
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`D1 API Error (${res.status}): ${JSON.stringify(json.errors || json)}`)
  }

  // Cloudflare D1 Query API can return result as an array of results or a single result object
  const resultData = Array.isArray(json.result) ? json.result[0] : (json.result || json)
  return resultData as D1Result<T>
}

/** Ensure tables exist */
export async function initD1Schema(): Promise<void> {
  if (!ACCOUNT_ID || !DB_ID || !TOKEN) {
    const missing = [];
    if (!ACCOUNT_ID) missing.push('CLOUDFLARE_ACCOUNT_ID');
    if (!DB_ID) missing.push('CLOUDFLARE_D1_DATABASE_ID');
    if (!TOKEN) missing.push('CLOUDFLARE_API_TOKEN');
    throw new Error(`Cloudflare keys missing: ${missing.join(', ')}`);
  }

  try {
    await d1Query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
    await d1Query(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
    await d1Query(`
      CREATE TABLE IF NOT EXISTS profiles (
        clerk_id TEXT PRIMARY KEY,
        email TEXT,
        plan TEXT DEFAULT 'FREE',
        points INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
  } catch (err: any) {
    console.error('D1 Schema Init Error:', err);
    throw new Error(`D1 Query Failed: ${err.message}`);
  }
}

export interface Message {
  id: string
  user_id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  created_at: string
}

/** Save a message to D1 */
export async function saveMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<void> {
  const { v4: uuidv4 } = await import('uuid')
  const id = uuidv4()
  
  // Ensure session exists
  await d1Query(
    `INSERT OR IGNORE INTO sessions (id, user_id, title) VALUES (?, ?, ?)`,
    [msg.session_id, msg.user_id, msg.content.substring(0, 30) || "وێنە"]
  )

  await d1Query(
    `INSERT INTO messages (id, user_id, session_id, role, content, image) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, msg.user_id, msg.session_id, msg.role, msg.content, msg.image || null]
  )
}

/** Rename a session */
export async function renameSession(sessionId: string, userId: string, title: string): Promise<void> {
  await d1Query(
    `UPDATE sessions SET title = ? WHERE id = ? AND user_id = ?`,
    [title, sessionId, userId]
  )
}

/** Delete a session and its messages */
export async function deleteSession(sessionId: string, userId: string): Promise<void> {
  await d1Query(`DELETE FROM messages WHERE session_id = ? AND user_id = ?`, [sessionId, userId])
  await d1Query(`DELETE FROM sessions WHERE id = ? AND user_id = ?`, [sessionId, userId])
}

/** Fetch messages */
export async function fetchRecentMessages(userId: string, sessionId?: string, limit = 50): Promise<Message[]> {
  if (!sessionId) return []
  const result = await d1Query<Message>(
    `SELECT * FROM messages WHERE user_id = ? AND session_id = ? ORDER BY created_at ASC LIMIT ?`,
    [userId, sessionId, limit]
  )
  return result.results || []
}

/** Fetch unique sessions */
export async function fetchSessions(userId: string): Promise<{ id: string; title: string; created_at: string }[]> {
  const result = await d1Query<{ id: string; title: string; created_at: string }>(
    `SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
    [userId]
  )
  return result.results || []
}
