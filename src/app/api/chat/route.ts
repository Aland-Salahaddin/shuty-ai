import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemini-2.0-flash-001'
];

const GEMINI_KEYS = process.env.GEMINI_API_KEYS 
  ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()) 
  : [process.env.GOOGLE_GENERATIVE_AI_API_KEY].filter(Boolean);

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and accurate responses strictly in Sorani Kurdish.
Always maintain a friendly, professional, and intelligent tone.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    let responseText = '';
    let lastError = '';

    // 1. TRY OPENROUTER FIRST
    if (OPENROUTER_KEY) {
      for (const model of OPENROUTER_MODELS) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_KEY}`,
              "HTTP-Referer": "https://shuty.ai",
              "X-Title": "Shuty AI",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
              temperature: 0.7,
            })
          });

          const data = await response.json();
          if (data.choices?.[0]?.message?.content) {
            responseText = data.choices[0].message.content;
            break;
          } else {
            lastError = data.error?.message || "OpenRouter Error";
          }
        } catch (e: any) {
          lastError = e.message;
        }
      }
    }

    // 2. FALLBACK TO DIRECT GEMINI IF OPENROUTER FAILED
    if (!responseText && GEMINI_KEYS.length > 0) {
      for (const key of GEMINI_KEYS as string[]) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              }))
            })
          });

          const data = await res.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            responseText = data.candidates[0].content.parts[0].text;
            break;
          }
        } catch (e: any) {
          lastError = e.message;
        }
      }
    }

    if (!responseText) {
      return NextResponse.json({ error: `All AI sources failed. Last error: ${lastError}` }, { status: 500 });
    }

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}