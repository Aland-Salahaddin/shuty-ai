import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.AUTH_RESEND_KEY || process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error('Missing Resend API Key');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Dynamic import to hide from static analysis
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Shuty AI <onboarding@resend.dev>',
      to: email,
      subject: 'Password Changed - Shuty AI',
      html: `
<!DOCTYPE html>
<html dir="rtl" lang="ckb">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            background-color: #fdfaf5;
            font-family: 'Tahoma', sans-serif;
            margin: 0;
            padding: 0;
        }
        .wrapper {
            padding: 20px;
        }
        .alert-card {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            border: 3px solid #1a1a1a;
            box-shadow: 12px 12px 0px #1a1a1a;
            padding: 40px;
        }
        .header {
            text-align: right;
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .logo {
            font-size: 24px;
            font-weight: 900;
            color: #1a1a1a;
        }
        .warning-tag {
            display: inline-block;
            background: #ffdb58;
            padding: 4px 12px;
            border: 2px solid #1a1a1a;
            font-weight: bold;
            transform: rotate(-1deg);
            margin-bottom: 20px;
        }
        h1 {
            font-size: 22px;
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.7;
            color: #333;
        }
        .action-box {
            background: #f1f1f1;
            border: 2px dashed #1a1a1a;
            padding: 20px;
            margin: 30px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="alert-card">
            <div class="header">
                <div class="logo">shuty.ai</div>
            </div>
            
            <div class="warning-tag">ئاگاداری!</div>
            
            <h1>وشەی نهێنی گۆڕدرا</h1>
            
            <p>سڵاو، ویستمان ئاگادارت بکەینەوە کە وشەی تێپەڕی ئەکاونتەکەت لە <b>shuty.ai</b> کەمێک پێش ئێستا گۆڕدرا.</p>
            
            <div class="action-box">
                <p style="margin-top: 0; font-weight: bold;">ئەگەر ئەمە تۆ بوویت:</p>
                <p style="font-size: 14px;">پێویست بە هیچ کارێکی تر ناکات و دەتوانیت ئەم ئیمەیڵە فەرامۆش بکەیت.</p>
                
                <p style="margin-bottom: 10px; font-weight: bold;">ئەگەر ئەمە تۆ نەبوویت:</p>
                <p style="margin-bottom: 10px; font-weight: bold;">وشەی نهێنیەکەت بگۆڕە!:</p>
            </div>
            
            <p style="font-size: 14px; color: #666;">
                ئەم ئاگادارییە بۆ دڵنیابوون لە پاراستنی زانیارییەکانت نێردراوە.
            </p>
            
            <div class="footer">
                نێردراوە لەلایەن تیمی shuty.ai <br>
                شوتی ، کوردستان
            </div>
        </div>
    </div>
</body>
</html>
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
