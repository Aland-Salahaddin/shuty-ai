import { NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-001'; // Stable and efficient

const SYSTEM_PROMPT = `You are Shuty, the world's most advanced Kurdish AI expert. 
Your goal is to provide helpful, natural, and accurate responses strictly in Sorani Kurdish.
Always maintain a friendly, professional, and intelligent tone.
If the user greets you in English or any other language, respond in Sorani Kurdish.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!OPENROUTER_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API Key is missing in Vercel settings." },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "HTTP-Referer": "https://shuty.ai",
        "X-Title": "Shuty AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2048,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: `OpenRouter Error (${response.status}): ${data.error?.message || JSON.stringify(data)}` },
        { status: response.status }
      );
    }

    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: "AI returned an empty response. Please check your OpenRouter credits." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: `System Error: ${error.message}` },
      { status: 500 }
    );
  }
}