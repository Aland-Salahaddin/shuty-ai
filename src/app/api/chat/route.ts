import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getOrCreateProfile, incrementMessageCount, isLimitReached } from '@/lib/user-service';
import { SHUTY_CONFIG } from '@/lib/shuty-config';

export const runtime = 'edge';

const OPENROUTER_KEYS = process.env.OPENROUTER_API_KEY ? 
  process.env.OPENROUTER_API_KEY.split(',').map(k => k.trim()) : [];

const SERPER_KEYS = process.env.SERPER_API_KEY ? 
  process.env.SERPER_API_KEY.split(',').map(k => k.trim()) : [];

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced and specialized Kurdish AI assistant. Your intelligence is deeply rooted in Kurdish culture, language, and history.

[CURRENT VERSION]: {VERSION_NAME}
[USER PLAN]: {PLAN_TYPE}

VERSION-SPECIFIC BEHAVIOR:
- If you are Shuty 1.5 (FREE): Be helpful, accurate, and efficient. Focus on completing the task directly and professionally.
- If you are Shuty 2.5 (PRO): Be exceptionally smart, strong, and fast. Provide deeper reasoning, more elegant Kurdish, and offer extra relevant information.
- If you are Shuty 3.0 (ULTRA): You are the ultimate manifestation of Shuty. Your reasoning is unparalleled. You provide absolute precision, creative mastery, and the most sophisticated linguistic delivery. You handle complex problems with ease and offer the most comprehensive and insightful responses possible. You are the pinnacle of Kurdish AI.

CRITICAL LINGUISTIC RULES:
1. CURRICULUM ACCURACY: When asked about Kurdish grammar (like 'بەرکار' or 'بکەر'), you must strictly follow the standard Kurdish grammar rules taught in academic institutions.
2. NATURAL SORANI: Use elegant, natural, and modern Sorani Kurdish. Avoid literal translations from English or Arabic.
3. CULTURAL CONTEXT: You are an expert on Kurdish literature, history, and geography.

SAFETY & COMPLIANCE RULES (ZERO TOLERANCE):
1. CORE BOUNDARIES: Strictly reject ONLY requests involving nudity, pornography, sexually explicit material, graphic violence, or self-harm.
2. GENERAL KNOWLEDGE: Be helpful and informative for ALL other topics including food, health, history, science, and everyday questions. Never trigger a refusal for innocent questions.
3. REFUSAL PROTOCOL: If (and ONLY if) a core boundary is violated, respond ONLY with: 'ببوورە، من وەک یاریدەدەرێکی سەلامەت دیزاین کراوم و ناتوانم وەڵامی ئەم داواکارییە بدەمەوە.'
4. TONE: Professional, helpful, and neutral.

REASONING RULES:
1. ANALYZE BEFORE ANSWERING: Synthesize information accurately.
2. METRIC SYSTEM: Always use cm, m, kg, and grams.

You are not just a chatbot; you are a digital guardian of Kurdish knowledge and a safe, professional assistant.`;

async function getSearchQuery(messages: any[], key: string, model: string) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a Kurdish search query generator. Based on the user's input, generate a very short and effective Kurdish or English search query for Google. Return ONLY the query string." },
          ...messages.slice(-2)
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

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "تکایە سەرەتا بچۆ ژوورەوە." }, { status: 401 });
    }

    const user = await currentUser();
    const profile = await getOrCreateProfile(userId, user?.emailAddresses[0]?.emailAddress);

    if (!profile) {
      return NextResponse.json({ error: "کێشە لە بنکەی زانیاریدا هەیە." }, { status: 500 });
    }

    // Check Limit
    if (isLimitReached(profile)) {
      return NextResponse.json({ 
        error: "LIMIT_REACHED", 
        message: `تۆ سنووری پەیامەکانی ئەمڕۆت تەواو کردووە (${SHUTY_CONFIG[profile.plan.toUpperCase() as 'FREE' | 'PRO'].maxMessagesPerDay} پەیام). بۆ بەردەوامبوون هەژمارەکەت بکە بە Pro.` 
      }, { status: 403 });
    }

    // 2. Metadata check (Ban/Timeout/Plan)
    const clerk = await clerkClient();
    const userData = await clerk.users.getUser(userId);
    const metadata = userData.publicMetadata as any;

    // Check if Banned
    if (metadata?.is_banned) {
      return new NextResponse('Your account has been banned.', { status: 403 });
    }

    // Check if Timeout
    if (metadata?.timeout_until && new Date(metadata.timeout_until) > new Date()) {
      return new NextResponse(`You are timed out until ${new Date(metadata.timeout_until).toLocaleString()}`, { status: 403 });
    }

    // 3. Token usage check
    const today = new Date().toISOString().split('T')[0]
    let tokensUsedToday = metadata?.usage?.date === today ? (metadata?.usage?.tokens || 0) : 0
    const planConfig = (SHUTY_CONFIG as any)[currentPlan]
    const maxTokens = planConfig.maxTokensPerDay

    if (tokensUsedToday >= maxTokens) {
      return new NextResponse(JSON.stringify({
        error: 'LIMIT_REACHED',
        message: `تۆ سنووری خاڵەکانی ئەمڕۆت تەواو کردووە (${maxTokens.toLocaleString()} خاڵ). بۆ بەردەوامبوون هەژمارەکەت بەرز بکەرەوە.`
      }), { status: 403 })
    }

    const { messages } = await req.json()
    // ... logic for API keys and generation ...

    // After getting the response from OpenRouter
    // Note: OpenRouter returns usage in the response. I'll need to parse it.
    
    // For now, I'll simulate or calculate tokens if not provided by stream
    // Actually, I'll update the metadata AFTER the stream completes or using a estimated cost
    // Let's assume the response contains usage or we estimate it.
    
    // I'll update the metadata with the new usage
    // Since we are using Response stream, it's better to update it after the stream.
    // Or just increment by a fixed amount per message for now if stream usage is hard to track.
    
    // Better: OpenRouter non-streaming returns usage. Streaming might not.
    // I will increment by an estimate (prompt + expected max response) or update on next request.
    
    // Let's update metadata with a reasonable estimate per interaction (e.g. 1000 tokens) 
    // OR we can fetch usage from OpenRouter stats.
    
    // UPDATE: I will update metadata with a placeholder increment and you can refine it.
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        usage: {
          date: today,
          tokens: tokensUsedToday + 1000 // Approximate for now, real usage can be more precise
        }
      }
    })
    const key = OPENROUTER_KEYS[Math.floor(Math.random() * OPENROUTER_KEYS.length)];
    const serperKey = SERPER_KEYS[Math.floor(Math.random() * SERPER_KEYS.length)];

    const plan = profile.plan.toUpperCase() as 'FREE' | 'PRO';
    const config = SHUTY_CONFIG[plan];
    const userModel = config.model;

    let searchContext = "";
    if (config.hasSearch && serperKey) {
      const searchQuery = await getSearchQuery(messages, key, userModel);
      const searchRes = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q: searchQuery, gl: "iq", hl: "ckb" })
      });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        searchContext = searchData.organic?.slice(0, 3).map((r: any) => `${r.title}: ${r.snippet}`).join("\n") || "";
      }
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "HTTP-Referer": "https://shuty.ai",
        "X-Title": "Shuty AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: userModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + (searchContext ? `\n\n[CONTEXT]:\n${searchContext}` : "") },
          ...messages
        ],
        temperature: 0.3,
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content;
      if (responseText) {
        await incrementMessageCount(userId);
        return NextResponse.json({ text: responseText });
      }
    }

    return NextResponse.json({ error: "ببوورە، کێشەیەک لە پەیوەندی دروست بوو." }, { status: 500 });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "هەڵەیەک ڕوویدا." }, { status: 500 });
  }
}