import { NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { getOrCreateProfile, incrementMessageCount, isLimitReached, updateProfilePoints } from '@/lib/user-service';
import { SHUTY_CONFIG } from '@/lib/shuty-config';
import { saveMessage, initD1Schema } from '@/lib/d1';

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
    
    const body = await req.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Initialize D1
    try {
      await initD1Schema();
    } catch (dbError: any) {
      console.error("D1_INIT_ERROR:", dbError);
      return NextResponse.json({ 
        error: "DB_INIT_FAILED", 
        message: "کێشە لە چالاککردنی بنکەی زانیاریدا هەیە. تکایە دڵنیا بەرەوە کلیلەکانی Cloudflare دروستن." 
      }, { status: 500 });
    }

    const clerk = await clerkClient();
    const userData = await clerk.users.getUser(userId);
    const metadata = userData.publicMetadata as any;

    // 1. Plan Expiry Check (30 days)
    let currentPlan = (metadata?.plan || 'FREE').toUpperCase();
    const expiryDate = metadata?.plan_expiry;

    if (currentPlan !== 'FREE' && expiryDate && new Date(expiryDate) < new Date()) {
      // Plan expired, reset to FREE
      await clerk.users.updateUser(userId, {
        publicMetadata: {
          ...metadata,
          plan: 'FREE',
          plan_expiry: null
        }
      });
      currentPlan = 'FREE';
    }

    const profile = await getOrCreateProfile(userId, userData.emailAddresses[0]?.emailAddress);
    if (!profile) {
      return NextResponse.json({ 
        error: "PROFILE_NOT_FOUND", 
        message: "هەژمارەکەت لە بنکەی زانیاریدا نەدۆزرایەوە." 
      }, { status: 500 });
    }

    const planConfig = (SHUTY_CONFIG as any)[currentPlan] || SHUTY_CONFIG.FREE;

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
    let imagesUsedToday = metadata?.usage?.date === today ? (metadata?.usage?.images || 0) : 0
    
    const maxTokens = planConfig.maxTokensPerDay
    const maxImages = planConfig.maxImagesPerDay

    if (tokensUsedToday >= maxTokens) {
      return new NextResponse(JSON.stringify({
        error: 'LIMIT_REACHED',
        message: `تۆ سنووری خاڵەکانی ئەمڕۆت تەواو کردووە (${maxTokens.toLocaleString()} خاڵ). بۆ بەردەوامبوون هەژمارەکەت بەرز بکەرەوە.`
      }), { status: 403 })
    }

    // Check for images in the new message
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role === 'user' && lastMsg.image) {
      if (imagesUsedToday >= maxImages) {
        return new NextResponse(JSON.stringify({
          error: 'LIMIT_REACHED',
          message: `تۆ سنووری وێنەکانی ئەمڕۆت تەواو کردووە (${maxImages} وێنە). بۆ بەردەوامبوون هەژمارەکەت بەرز بکەرەوە.`
        }), { status: 403 })
      }
      imagesUsedToday += 1
    }

    // Save user message to history if sessionId exists
    if (sessionId) {
      await saveMessage({
        user_id: userId,
        session_id: sessionId,
        role: 'user',
        content: lastMsg.content || "",
        image: lastMsg.image
      }).catch(console.error);
    }

    // Format messages for multimodal support
    const formattedMessages = messages.map((m: any) => {
      if (m.image && m.role === 'user') {
        return {
          role: m.role,
          content: [
            { type: 'text', text: m.content || "ئەم وێنەیە شی بکەرەوە" },
            { type: 'image_url', image_url: { url: m.image } }
          ]
        }
      }
      return { role: m.role, content: m.content }
    })

    // Update metadata with usage
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        usage: {
          date: today,
          tokens: tokensUsedToday + 1000,
          images: imagesUsedToday
        }
      }
    })

    const key = OPENROUTER_KEYS[Math.floor(Math.random() * OPENROUTER_KEYS.length)];
    const serperKey = SERPER_KEYS[Math.floor(Math.random() * SERPER_KEYS.length)];

    const userModel = planConfig.model;
    const finalPrompt = SYSTEM_PROMPT
      .replace('{VERSION_NAME}', planConfig.displayName)
      .replace('{PLAN_TYPE}', currentPlan);

    let searchContext = "";
    if (planConfig.hasSearch && serperKey) {
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
          { role: 'system', content: finalPrompt + (searchContext ? `\n\n[CONTEXT]:\n${searchContext}` : "") },
          ...formattedMessages
        ],
        temperature: 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API Error:", response.status, errorData);
      return NextResponse.json({ 
        error: `OpenRouter Error (${response.status})`,
        message: errorData.error?.message || "کێشەیەک لە پەیوەندی بە زیرەکی دەستکرد دروست بوو." 
      }, { status: response.status });
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;
    
    if (responseText) {
      await incrementMessageCount(userId);
      
      // Save assistant message to history
      if (sessionId) {
        await saveMessage({
          user_id: userId,
          session_id: sessionId,
          role: 'assistant',
          content: responseText
        }).catch(err => console.error("History Save Error:", err));
      }

      return NextResponse.json({ text: responseText });
    }

    return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });

  } catch (error: any) {
    console.error("CRITICAL_CHAT_ERROR:", error);
    return NextResponse.json({ 
      error: "INTERNAL_ERROR",
      message: error.message || "هەڵەیەک لە سێرڤەر ڕوویدا." 
    }, { status: 500 });
  }
}