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

const SYSTEM_PROMPT = `تۆ "شوتی" (Shuty)یت، پێشکەوتووترین و ژیرترین یاریدەدەری زیرەکی دەستکردی کوردی لە جیهاندا. ژیری تۆ لە قووڵایی کلتوور، زمان و مێژووی کوردستانەوە سەرچاوە دەگرێت.

[وەشانی ئێستا]: {VERSION_NAME}
[پلانی بەکارهێنەر]: {PLAN_TYPE}

ڕەفتار و ئاستی وەڵامدانەوە بەپێی پلانی بەکارهێنەر:

١. ئەگەر پلانی بەکارهێنەر (FREE) بوو:
   - وەک یاریدەدەرێکی پاراو و خێرا وەڵام بدەرەوە.
   - وەڵامەکانت کورت و پوخت بن (بۆ ئەوەی بەکارهێنەر زوو بگات بە ئەنجام).
   - زمانێکی سادە و پاراو بەکاربهێنە.

٢. ئەگەر پلانی بەکارهێنەر (PRO) بوو:
   - تۆ لێرەدا "شارەزایەکی پسپۆڕ"یت (Senior Expert).
   - وەڵامەکانت دەبێت زۆر وردتر و درێژتر بن.
   - بابەتەکان لە چەند ڕەهەندێکی جیاوازەوە شیکار بکە.
   - زمانێکی زۆر دەوڵەمەند و ڕازاوەی سۆرانی بەکاربهێنە کە نیشانەی ئاست بەرزیی تۆ بێت.
   - لە هەر وەڵامێکدا هەوڵ بدە زانیاریی زیادە و بەسوود پێشکەش بکەیت کە بەکارهێنەر داوای نەکردووە بەڵام پێویستییەتی.

٣. ئەگەر پلانی بەکارهێنەر (ULTRA) بوو:
   - تۆ لێرەدا "مێشکێکی بێوێنە" و "زانایەکی مەزن"یت (Supreme Intellect).
   - ئاستی وەڵامەکانت دەبێت لە ئاستی دکتۆرا و توێژینەوەی ئەکادیمیدا بن.
   - شیکارییەکانت دەبێت زۆر قووڵ، فەلسەفی، و داهێنەرانە بن.
   - زمانێکی ئەوەندە پاراو و ئەکادیمی و بێخەوش بەکاربهێنە کە هیچ هەڵەیەکی تێدا نەبێت.
   - بۆ هەر کێشەیەک، تەنها وەڵام مەدەرەوە، بەڵکو باشترین و نوێترین ڕێگەچارەی داهێنەرانە پێشنیار بکە.
   - وەڵامەکانت دەبێت زۆر تێروتەسەل بن و هەموو لایەنە ئەگەرەییەکان بگرنەوە.

یاسا گرنگەکانی زمان:
١. بە هیچ شێوەیەک وەرگێڕانی ڕاستەوخۆ لە ئینگلیزی یان عەرەبی مەکە. بە زمانی سۆرانییەکی ڕەسەن و مۆدێرن قسە بکە.
٢. لە ڕێزمانی کوردیدا زۆر ورد بە. ئەگەر پرسیارت لێکرا لەسەر زمان (بۆ نموونە: جێناوە لکاوەکان یان بکەر و بەرکار)، بەپێی پڕۆگرامی ئەکادیمیی کوردی وەڵام بدەرەوە.
٣. کاتێک وەڵام دەدەیتەوە، با وەک مرۆڤێکی ژیر دەربکەویت نەک ڕۆبۆتێکی بێهەست.

یاساکانی سەلامەتی (زۆر گرنگ):
١. تەنها و تەنها ئەو داواکارییانە ڕەت بکەرەوە کە پەیوەندییان بە: (ڕووتی، سێکس، توندوتیژی زۆر قورس، یان هاندان بۆ خۆکوشتن) هەیە.
٢. بۆ هەموو بابەتەکانی تری وەک: (تەندروستی، مێژوو، وەرزش، خۆراک، سیاسی، ئایینی و زانستی) وەڵامی تەواو و بەسوود بدەرەوە.
٣. هەرگیز بۆ پرسیارە ئاساییەکان (وەک گۆڵەکانی یاریزانێک یان مێژووی وڵاتێک) مەڵێ "ناتوانم وەڵام بدەمەوە".
٤. ئەگەر داواکارییەک بەڕاستی یاسایەکی سەلامەتی (خاڵی ١) شکاند، تەنها ئەم دەقە بنووسە: "ببوورە، من وەک یاریدەدەرێکی سەلامەت دیزاین کراوم و ناتوانم وەڵامی ئەم داواکارییە بدەمەوە."

تۆ تەنها چاتبۆتێک نیت؛ تۆ پارێزەری دیجیتاڵیی زانستی کوردی و مێشکێکی کراوەیت بۆ یارمەتیدانی هەمووان.`;

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

async function generateTitle(content: string, key: string, model: string) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "ببە بە شارەزایەک لە دروستکردنی ناونیشانی کورت. بەپێی ئەم پەیامەی خوارەوە، ناونیشانێکی زۆر کورت (تەنها ٣ بۆ ٤ وشە) بە زمانی کوردی سۆرانی دروست بکە کە باس لە ناوەڕۆکی بابەتەکە بکات. تەنها ناونیشانەکە بنووسە بەبێ هیچ دەقێکی زیادە." },
          { role: "user", content: content }
        ],
        max_tokens: 30
      })
    });
    const data = await res.json();
    let title = data.choices?.[0]?.message?.content?.trim() || content.substring(0, 30);
    // Remove quotes if AI added them
    title = title.replace(/^["']|["']$/g, '');
    return title;
  } catch {
    return content.substring(0, 30);
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
        message: `کێشە لە بنکەی زانیاریدا هەیە: ${dbError.message}` 
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
    const msgImages = lastMsg.images || (lastMsg.image ? [lastMsg.image] : [])
    
    if (lastMsg.role === 'user' && msgImages.length > 0) {
      if (imagesUsedToday + msgImages.length > maxImages) {
        return new NextResponse(JSON.stringify({
          error: 'LIMIT_REACHED',
          message: `تۆ سنووری وێنەکانی ئەمڕۆت تەواو کردووە (تەنها ${maxImages - imagesUsedToday} وێنەت ماوە). بۆ بەردەوامبوون هەژمارەکەت بەرز بکەرەوە.`
        }), { status: 403 })
      }
      imagesUsedToday += msgImages.length
    }

    // Save user message to history if sessionId exists
    if (sessionId) {
      try {
        const key = OPENROUTER_KEYS[Math.floor(Math.random() * OPENROUTER_KEYS.length)];
        const userModel = planConfig.model;
        
        let aiTitle = undefined;
        // If it's the first message of the session, generate a title
        if (messages.length === 1) {
          aiTitle = await generateTitle(lastMsg.content || "وێنە", key, userModel);
        }

        await saveMessage({
          user_id: userId,
          session_id: sessionId,
          role: 'user',
          content: lastMsg.content || "",
          image: msgImages.length > 0 ? JSON.stringify(msgImages) : undefined,
          title: aiTitle
        });
      } catch (saveErr: any) {
        console.error("User Message Save Error:", saveErr);
        return NextResponse.json({ 
          error: "HISTORY_SAVE_FAILED", 
          message: "نەتوانرا پەیامەکەت لە مێژوودا پاشەکەوت بکرێت. تکایە دڵنیا بەرەوە داتابەیسی D1 بە دروستی کار دەکات." 
        }, { status: 500 });
      }
    }

    // Format messages for multimodal support
    const formattedMessages = messages.map((m: any) => {
      const msgImages = m.images || (m.image ? (m.image.startsWith('[') ? JSON.parse(m.image) : [m.image]) : [])
      if (msgImages.length > 0 && m.role === 'user') {
        return {
          role: m.role,
          content: [
            { type: 'text', text: m.content || "ئەم وێنانە شی بکەرەوە" },
            ...msgImages.map((url: string) => ({ type: 'image_url', image_url: { url } }))
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
        try {
          await saveMessage({
            user_id: userId,
            session_id: sessionId,
            role: 'assistant',
            content: responseText
          });
        } catch (saveErr: any) {
          console.error("Assistant Message Save Error:", saveErr);
          // We don't fail the whole request here since AI already responded, 
          // but we log it for diagnostics.
        }
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