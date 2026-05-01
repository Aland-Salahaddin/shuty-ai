import { NextRequest, NextResponse } from 'next/server'
import { fetchRecentMessages, fetchSessions, deleteSession, renameSession, initD1Schema } from '@/lib/d1'
import { auth } from '@clerk/nextjs/server'

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Initialize tables if needed
  await initD1Schema().catch(console.error)

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id') ?? undefined
  const type = searchParams.get('type') ?? 'messages'

  if (type === 'sessions') {
    const sessions = await fetchSessions(userId)
    return NextResponse.json({ sessions })
  }

  const messages = await fetchRecentMessages(userId, sessionId, 50)
  return NextResponse.json({ messages })
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

  await deleteSession(sessionId, userId)
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId, title } = await req.json()
  if (!sessionId || !title) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  await renameSession(sessionId, userId, title)
  return NextResponse.json({ success: true })
}
