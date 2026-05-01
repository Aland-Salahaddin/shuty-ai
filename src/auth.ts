import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { Resend as ResendClient } from "resend"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY || "re_12345678901234567890123456789012",
      from: "Shuty AI <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        if (provider.apiKey === "re_12345678901234567890123456789012") {
          throw new Error("Missing Resend API Key. Please configure it in your environment variables.");
        }
        const resend = new ResendClient(provider.apiKey)
        
        const { error } = await resend.emails.send({
          from: provider.from!,
          to: email,
          subject: "Sign in to Shuty AI",
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
        .welcome-tag {
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
            text-align: center;
        }
        .btn-confirm {
            display: inline-block;
            background-color: #B5462E;
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 32px;
            font-weight: 800;
            border: 3px solid #1a1a1a;
            box-shadow: -5px 5px 0px #1a1a1a;
            font-size: 18px;
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
            
            <div class="welcome-tag">بەخێربێیت!</div>
            
            <h1>پشتڕاستکردنەوەی هەژمار</h1>
            
            <p>سڵاو، سوپاس بۆ ناونووسینت لە <b>shuty.ai</b>. بۆ ئەوەی دەست بکەیت بە بەکارهێنانی زیرەکی دەستکرد بە زمانی کوردی، تکایە کرتە لە دوگمەی خوارەوە بکە بۆ چوونەژوورەوە.</p>
            
            <div class="action-box">
                <a href="${url}" class="btn-confirm">چوونەژوورەوە بۆ shuty.ai</a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
                ئەگەر ئەم داواکارییە لەلایەن تۆوە نەبووە، دەتوانیت ئەم ئیمەیڵە پشتگوێ بخەیت.
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
        })

        if (error) {
          throw new Error(error.message)
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
    verifyRequest: '/verify',
  },
})
