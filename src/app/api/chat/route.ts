import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

const OPENROUTER_KEYS = process.env.OPENROUTER_API_KEY ? 
  process.env.OPENROUTER_API_KEY.split(',').map(k => k.trim()) : [];

const SERPER_KEYS = process.env.SERPER_API_KEY ?
  process.env.SERPER_API_KEY.split(',').map(k => k.trim()) : [];

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free'
];

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and clear responses strictly in Sorani Kurdish.

CRITICAL INSTRUCTIONS:
1. DO NOT just list different search results. Instead, analyze all the search data, find the most logical and common answer, and provide it as a single, clear explanation.
2. If the user asks about "bags" or "packets," prioritize information for that specific unit. 
3. Use natural Sorani Kurdish. Avoid robotic bullet points or technical jargon unless necessary.
4. BE DECISIVE. If search results say different things, pick the most reliable one (e.g., from the official brand) and present it clearly.
5. Never say "according to result 1" or "source says". Just talk naturally as Shuty.
6. USE THE METRIC SYSTEM (cm, meters, kg, grams) for all measurements by default. Only use Imperial units (inches, feet, lbs) if the user specifically requests them.`;

async function getSearchQuery(messages: any[], key: string) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: "Create a short English search query to find the exact info the user wants. Example: 'Lays ketchup chips calories 25g'. Only return the query." },
          ...messages.slice(-3)
        ],
        max_tokens: 30
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || messages[messages.length - 1].content;
  } catch {
    return messages[messages.length - 1].content;
  }
}

async function performSearch(query: string) {
  if (SERPER_KEYS.length === 0) return null;
  for (const key of SERPER_KEYS) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, num: 8 })
      });
      if (response.ok) {
        const data = await response.json();
        const results = data.organic?.map((res: any) => `- ${res.title}: ${res.snippet}`).join('\n');
        return results || null;
      }
    } catch (e) {
      console.error("Search error");
    }
  }
  return null;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ text: "تکایە سەرەتا بچۆ ژوورەوە." }, { status: 401 });
  }

  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content;
    let responseText = '';
    let searchContext = '';

    if (lastUserMessage && SERPER_KEYS.length > 0 && OPENROUTER_KEYS[0]) {
      const query = await getSearchQuery(messages, OPENROUTER_KEYS[0]);
      const results = await performSearch(query);
      if (results) {
        searchContext = `\n\n[REAL-TIME GOOGLE DATA FOUND]:\n${results}\n\nINSTRUCTION: Use the data above to answer the user's question in Kurdish accurately.`;
      }
    }

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
                { role: 'system', content: SYSTEM_PROMPT + searchContext },
                ...messages
              ],
              temperature: 0.3,
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.choices?.[0]?.message?.content) {
              responseText = data.choices[0].message.content;
              break;
            }
          } else if (response.status === 429) break;
        } catch (e) {
          console.error("OpenRouter error");
        }
      }
    }

    return NextResponse.json({ text: responseText || "ببوورە، کێشەیەک لە پەیوەندی دروست بوو." });

  } catch (error) {
    return NextResponse.json({ text: "هەڵەیەک ڕوویدا." });
  }
}