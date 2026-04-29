import { NextRequest, NextResponse } from 'next/server'
import { saveMessage } from '@/lib/d1'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge';

const GEMINI_KEYS = [
  'AIzaSyDni5BYZ8NoaIyuDdFyUUitmaDYN2L5rb0',
  'AIzaSyBPAhMeV69NRpbYcWigp8MvA4YZvSLxOMs',
  'AIzaSyArVewDPqiYEEQh_FuzmI0JdQbXd-aJ-Ns',
  'AIzaSyDANT7CBaUpH-oBmtCT1k2QvY5z31_80pQ',
  'AIzaSyApugFRrqXawFpJc_fY61uGoju-yye2cfk',
  'AIzaSyAZmuWxTo3ApXaTeeNRXfcZNEpaPbHNhIg'
]

const MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash']

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and accurate responses strictly in Sorani Kurdish.
Always remember the context of the conversation and be conversational.`

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'anonymous'

    const { messages, sessionId } = await req.json()
    const lastUserMessage = messages[messages.length - 1].content
    
    // 1. SAVE USER MESSAGE
    if (userId !== 'anonymous') {
      await saveMessage({ 
        user_id: userId, 
        session_id: sessionId, 
        role: 'user', 
        content: lastUserMessage 
      }).catch(console.error)
    }

    // 2. CONSTRUCT FULL CONVERSATION HISTORY FOR GEMINI
    // Map 'assistant' to 'model' as required by Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    let responseText = null
    let lastError = ''

    for (const key of GEMINI_KEYS) {
      for (const model of MODELS) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              },
              contents: contents,
              generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 2048,
              }
            })
          })

          const data = await res.json()
          if (res.ok) {
            responseText = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (responseText) break
          } else {
            lastError = data.error?.message || JSON.stringify(data)
          }
        } catch (e: any) {
          lastError = e.message
        }
      }
      if (responseText) break
    }

    if (!responseText) {
      return NextResponse.json({ error: 'AI_UNAVAILABLE', details: lastError }, { status: 503 })
    }

    // 3. SAVE ASSISTANT MESSAGE
    if (userId !== 'anonymous') {
      await saveMessage({ 
        user_id: userId, 
        session_id: sessionId, 
        role: 'assistant', 
        content: responseText 
      }).catch(console.error)
    }

    return NextResponse.json({ text: responseText })

  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_CRASH', details: err.message }, { status: 500 })
  }
}
