import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Supports multiple keys separated by commas
const OPENROUTER_KEYS = process.env.OPENROUTER_API_KEY ? 
  process.env.OPENROUTER_API_KEY.split(',').map(k => k.trim()) : [];

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and accurate responses strictly in Sorani Kurdish.
Always maintain a friendly, professional, and intelligent tone.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    let responseText = '';

    // 1. TRY OPENROUTER KEYS ONE BY ONE
    if (OPENROUTER_KEYS.length > 0) {
      for (const key of OPENROUTER_KEYS) {
        if (responseText) break; // Stop if we already got a response

        // For each key, try the different models
        for (const model of OPENROUTER_MODELS) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${key}`,
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
                break; // Found a working model for this key
              }
            } else {
              // If we hit a rate limit (429), try the next key immediately
              const errorData = await response.json().catch(() => ({}));
              if (response.status === 429) {
                console.log("Rate limited on current key, moving to next key...");
                break; // Exit the models loop to try the next KEY
              }
            }
          } catch (e: any) {
            console.error(`Fetch error with key ${key.substring(0, 8)}... and model ${model}:`, e.message);
          }
        }
      }
    }

    // 2. FINAL GRACEFUL FAILURE
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