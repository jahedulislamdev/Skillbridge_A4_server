import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import appConfig from "../config";
import nodemailer from "nodemailer";

//* SMTP TRANSPORT (Gmail)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: appConfig.nm_user,
        pass: appConfig.nm_pass,
    },
});

//* AUTH CONFIG

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [appConfig.app_url || "http://localhost:3000"],

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
            },
            isBanned: {
                type: "string",
                required: false,
                defaultValue: false,
            },
        },
    },
    callbacks: {
        async session({ session, user }: { session: any; user: any }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    isBanned: user.isBanned ?? false,
                },
            };
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: appConfig.gc_id as string,
            clientSecret: appConfig.gc_pass as string,
        },
    },

    //* EMAIL VERIFICATION

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,

        sendVerificationEmail: async ({ user, url }) => {
            try {
                const verificationUrl = url;

                await transporter.sendMail({
                    from: `"Skillbridge Team" <${appConfig.nm_user}>`,
                    to: user.email,
                    subject: "Verify your Skillbridge account",

                    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f7f6; margin:0; }
    .container { max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; }
    .header { background:#0056b3; color:#fff; padding:25px; text-align:center; }
    .content { padding:30px; line-height:1.6; }
    .btn {
      display:inline-block;
      padding:12px 20px;
      background:#0056b3;
      color:#fff;
      text-decoration:none;
      border-radius:6px;
      margin-top:20px;
    }
    .footer { font-size:12px; text-align:center; padding:15px; color:#777; }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <h2>Skillbridge</h2>
    </div>

    <div class="content">
      <h3>Hello ${user.name || "User"},</h3>
      <p>Thanks for joining Skillbridge. Please verify your email to activate your account.</p>

      <a href="${verificationUrl}" class="btn">Verify Account</a>

      <p style="margin-top:20px; font-size:12px;">
        If button doesn't work, copy this link:<br/>
        ${verificationUrl}
      </p>

      <p style="margin-top:20px;">If you didn’t request this, ignore this email.</p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Skillbridge
    </div>

  </div>
</body>
</html>
                    `,
                });
            } catch (error) {
                console.error("Email verification error:", error);
                throw error;
            }
        },
    },
});
