import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_KEYS = process.env.OPENROUTER_API_KEY ? 
  process.env.OPENROUTER_API_KEY.split(',').map(k => k.trim()) : [];

const SERPER_KEYS = process.env.SERPER_API_KEY ?
  process.env.SERPER_API_KEY.split(',').map(k => k.trim()) : [];

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free'
];

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and accurate responses strictly in Sorani Kurdish.
Always maintain a friendly, professional, and intelligent tone. 
When search results are provided, use them to give accurate and up-to-date information. 
DO NOT mention that you are searching or that you have snippets unless asked. Just provide the answer.`;

// Helper to get a smart English search query from the user's Kurdish message
async function getSearchQuery(kurdishText: string, key: string) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: `Translate this Kurdish search query to a short, effective English search query. Only return the English text: "${kurdishText}"` }],
        max_tokens: 20
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || kurdishText;
  } catch {
    return kurdishText;
  }
}

async function performSearch(query: string) {
  if (SERPER_KEYS.length === 0) return null;
  for (const key of SERPER_KEYS) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query }) 
      });
      if (response.ok) {
        const data = await response.json();
        return data.organic?.slice(0, 5).map((res: any) => 
          `Title: ${res.title}\nSnippet: ${res.snippet}`
        ).join('\n\n');
      }
    } catch (e) {
      console.error("Search failed");
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

    if (lastUserMessage && SERPER_KEYS.length > 0 && OPENROUTER_KEYS[0]) {
      // 1. Get English query for better results
      const englishQuery = await getSearchQuery(lastUserMessage, OPENROUTER_KEYS[0]);
      
      // 2. Perform the actual search
      const results = await performSearch(englishQuery);
      if (results) {
        searchContext = `\n\n[LATEST SEARCH RESULTS FROM GOOGLE]:\n${results}\n\nUse this data to answer the user in Kurdish.`;
      }
    }

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
            } else if (response.status === 429) break;
          } catch (e: any) {
            console.error("OpenRouter error");
          }
        }
      }
    }

    if (!responseText) {
      return NextResponse.json({ text: "ببوورە، سەرچاوەکانمان قەرەباڵغن. تکایە یەک خولەکی تر هەوڵ بدەرەوە. 😊" });
    }

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    return NextResponse.json({ text: "هەڵەیەک ڕوویدا. تکایە پەیجەکە نوێ بکەرەوە." });
  }
}