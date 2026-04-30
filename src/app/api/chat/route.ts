import { NextRequest, NextResponse } from 'next/server'
import { saveMessage } from '@/lib/d1'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'; // Using Llama 3.3 70B FREE

// Gemini configuration (as fallback)
const ENV_KEYS = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()) : [];
const DEFAULT_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const GEMINI_KEYS = Array.from(new Set([...ENV_KEYS, DEFAULT_KEY].filter(Boolean)));
const GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro']

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

    // 1. TRY OPENROUTER FIRST (Dolphin 3.0 R1)
    if (OPENROUTER_KEY) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": OPENROUTER_MODEL,
            "messages": [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages
            ]
          })
        });

        const data = await res.json();
        if (res.ok) {
          responseText = data.choices?.[0]?.message?.content;
        } else {
          lastError = data.error?.message || "OpenRouter Error";
        }
      } catch (e: any) {
        lastError = e.message;
      }
    }

    // 2. FALLBACK TO GEMINI IF OPENROUTER FAILED OR IS NOT CONFIGURED
    if (!responseText) {
      for (const key of GEMINI_KEYS) {
        for (const model of GEMINI_MODELS) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${SYSTEM_PROMPT}` }] },
                  ...messages.map((m: any) => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                  }))
                ],
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