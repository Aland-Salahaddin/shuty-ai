import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

const OPENROUTER_KEYS = process.env.OPENROUTER_API_KEY ? 
  process.env.OPENROUTER_API_KEY.split(',').map(k => k.trim()) : [];

const SERPER_KEYS = process.env.SERPER_API_KEY ?
  process.env.SERPER_API_KEY.split(',').map(k => k.trim()) : [];

const OPENROUTER_MODELS = [
  'anthropic/claude-3.5-sonnet',
  'google/gemini-pro-1.5',
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct:free'
];

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced and specialized Kurdish AI assistant. Your intelligence is deeply rooted in Kurdish culture, language, and history.

CRITICAL LINGUISTIC RULES:
1. CURRICULUM ACCURACY: When asked about Kurdish grammar (like 'بەرکار' or 'بکەر'), you must strictly follow the standard Kurdish grammar rules taught in academic institutions. For example, understand Kurdish ergativity and how objects/subjects behave in different tenses.
2. NATURAL SORANI: Use elegant, natural, and modern Sorani Kurdish. Avoid literal translations from English or Arabic.
3. CULTURAL CONTEXT: You are an expert on Kurdish literature (Piramerd, Sherko Bekas, etc.), history, and geography.

REASONING RULES:
1. ANALYZE BEFORE ANSWERING: Don't just repeat search results. Synthesize information from multiple sources to find the most accurate and logical answer.
2. SOURCE PRIORITIZATION: Prioritize Kurdish academic websites, official documentation, and recognized cultural sources.
3. DECISIVENESS: Be authoritative but humble. If there's a debate on a topic (like a grammar rule), explain the most common usage.
4. METRIC SYSTEM: Always use cm, m, kg, and grams unless the user asks for other units.

You are not just a chatbot; you are a digital guardian of Kurdish knowledge. Your answers should reflect high intelligence and deep cultural awareness.`;

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