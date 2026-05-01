import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Shuty AI <onboarding@resend.dev>',
      to: email,
      subject: 'Password Changed - Shuty AI',
      html: `
        <div style="direction: rtl; font-family: 'Vazirmatn', sans-serif; padding: 30px; border: 3px solid #1C1A17; background: #F0E6D0; box-shadow: -10px 10px 0 0 #D4A53A;">
          <h1 style="color: #B5462E; border-bottom: 2px solid #1C1A17; padding-bottom: 10px;">ئاگاداری گۆڕینی وشەی نهێنی</h1>
          <p style="font-size: 16px; color: #1C1A17; line-height: 1.6;">سڵاو،</p>
          <p style="font-size: 16px; color: #1C1A17; line-height: 1.6;">ئەم ئیمەیڵەت بۆ دێت چونکە وشەی نهێنی هەژمارەکەت لە <strong>Shuty AI</strong> گۆڕدرا.</p>
          <div style="background: #EDE0C5; padding: 15px; border: 2px solid #1C1A17; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #6B7341;">ئەگەر تۆ خۆت ئەم کارەت نەکردووە، تکایە بە زووترین کات پەیوەندیمان پێوە بکە بۆ پاراستنی هەژمارەکەت.</p>
          </div>
          <p style="font-size: 14px; color: #6B7341;">ئەمە ئیمەیڵێکی ئۆتۆماتیکییە، تکایە وەڵام مەدەرەوە.</p>
          <hr style="border: 1px dashed #1C1A17; margin: 30px 0;" />
          <p style="font-weight: 800; color: #1C1A17;">Shuty AI Team</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Email error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
