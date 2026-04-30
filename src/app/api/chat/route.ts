import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Supports multiple keys separated by commas
const OPENROUTER_KEYS = process.env.OPENROUTER_API_KEY ? 
  process.env.OPENROUTER_API_KEY.split(',').map(k => k.trim()) : [];

const SERPER_KEYS = process.env.SERPER_API_KEY ?
  process.env.SERPER_API_KEY.split(',').map(k => k.trim()) : [];

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and accurate responses strictly in Sorani Kurdish.
Always maintain a friendly, professional, and intelligent tone. 
When search results are provided, use them to give accurate and up-to-date information.`;

async function performSearch(query: string) {
  if (SERPER_KEYS.length === 0) return null;

  for (const key of SERPER_KEYS) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: query, gl: 'iq', hl: 'ku' }) // Targeted for Iraq/Kurdish
      });

      if (response.ok) {
        const data = await response.json();
        const snippets = data.organic?.slice(0, 5).map((res: any) => 
          `Title: ${res.title}\nSnippet: ${res.snippet}\nLink: ${res.link}`
        ).join('\n\n');
        return snippets;
      }
    } catch (e) {
      console.error("Search failed with a key, trying next...");
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content;
    let responseText = '';
    let searchContext = '';

    // 1. PERFORM SEARCH IF ENABLED
    if (lastUserMessage && SERPER_KEYS.length > 0) {
      const results = await performSearch(lastUserMessage);
      if (results) {
        searchContext = `\n\n[ئەنجامی گەڕان لە گووگڵ بۆ ئەم پرسیارە]:\n${results}\n\nتکایە بەپێی ئەم زانیارییانەی سەرەوە وەڵامی بەکارهێنەر بدەرەوە بە زمانی کوردی.`;
      }
    }

    // 2. TRY OPENROUTER KEYS ONE BY ONE
    if (OPENROUTER_KEYS.length > 0) {
      for (const key of OPENROUTER_KEYS) {
        if (responseText) break;

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
                messages: [
                  { role: 'system', content: SYSTEM_PROMPT + (searchContext ? searchContext : "") },
                  ...messages
                ],
                temperature: 0.7,
              })
            });

            if (response.ok) {
              const data = await response.json();
              if (data.choices?.[0]?.message?.content) {
                responseText = data.choices[0].message.content;
                break;
              }
            } else if (response.status === 429) {
              break; 
            }
          } catch (e: any) {
            console.error(`Fetch error with key ${key.substring(0, 8)}... and model ${model}:`, e.message);
          }
        }
      }
    }

    if (!responseText) {
      return NextResponse.json({ 
        text: "ببوورە، لەم ساتەدا زۆربەی سەرچاوەکانمان قەرەباڵغن. تکایە تەنها یەک خولەکی تر هەوڵ بدەرەوە. 😊" 
      });
    }

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    return NextResponse.json({ text: "هەڵەیەک لە سیستەمدا ڕوویدا. تکایە پەیجەکە نوێ بکەرەوە." });
  }
}