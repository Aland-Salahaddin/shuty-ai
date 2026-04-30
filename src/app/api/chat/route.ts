import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
// List of 5 different FREE models to ensure one always works
const OPENROUTER_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free'
];

// Combine all possible Gemini keys
const GEMINI_KEYS = Array.from(new Set([
  ...(process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()) : []),
  process.env.GOOGLE_GENERATIVE_AI_API_KEY
].filter(Boolean)));

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and accurate responses strictly in Sorani Kurdish.
Always maintain a friendly, professional, and intelligent tone.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    let responseText = '';
    let lastError = '';

    // 1. SMART RETRY WITH OPENROUTER (Try 5 different models)
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

          if (response.ok) {
            const data = await response.json();
            if (data.choices?.[0]?.message?.content) {
              responseText = data.choices[0].message.content;
              break; // SUCCESS!
            }
          }
        } catch (e: any) {
          console.error(`Failed with ${model}:`, e.message);
        }
      }
    }

    // 2. LAST RESORT: DIRECT GEMINI
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

          if (res.ok) {
            const data = await res.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              responseText = data.candidates[0].content.parts[0].text;
              break;
            }
          }
        } catch (e: any) {
          lastError = e.message;
        }
      }
    }

    // 3. IF EVERYTHING FAILS, DON'T SHOW A RED ERROR, SHOW A FRIENDLY MESSAGE
    if (!responseText) {
      return NextResponse.json({ 
        text: "ببوورە، لەم ساتەدا زۆربەی سەرچاوەکانمان قەرەباڵغن. تکایە تەنها یەک خولەکی تر هەوڵ بدەرەوە، Shuty یەکسەر ئامادە دەبێتەوە بۆ وەڵامدانەوەی تۆ. 😊" 
      });
    }

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    return NextResponse.json({ text: "هەڵەیەک لە سیستەمدا ڕوویدا. تکایە پەیجەکە نوێ بکەرەوە." });
  }
}