import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const { email, password, mode, fullName } = body

  if (mode === 'signup') {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ user: data.user })
  }

  if (mode === 'login') {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ user: data.user, session: data.session })
  }

  if (mode === 'reset') {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(req.url).origin}/settings`,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  if (mode === 'logout') {
    await supabase.auth.signOut()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
}
