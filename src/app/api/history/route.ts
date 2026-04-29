import { NextRequest, NextResponse } from 'next/server'
import { fetchRecentMessages, fetchSessions, deleteSession, renameSession, initD1Schema } from '@/lib/d1'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Initialize tables if needed
  await initD1Schema().catch(console.error)

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id') ?? undefined
  const type = searchParams.get('type') ?? 'messages'

  if (type === 'sessions') {
    const sessions = await fetchSessions(user.id)
    return NextResponse.json({ sessions })
  }

  const messages = await fetchRecentMessages(user.id, sessionId, 50)
  return NextResponse.json({ messages })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

  await deleteSession(sessionId, user.id)
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId, title } = await req.json()
  if (!sessionId || !title) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  await renameSession(sessionId, user.id, title)
  return NextResponse.json({ success: true })
}
