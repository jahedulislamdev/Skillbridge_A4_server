import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oAuthProxy } from "better-auth/plugins";
import nodemailer from "nodemailer";

import appConfig from "../config/index.js";
import { prisma } from "./prisma";

// ======================================================
// SMTP TRANSPORT (GMAIL)
// ======================================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: appConfig.nm_user,
        pass: appConfig.nm_pass,
    },
});

// ======================================================
// EMAIL TEMPLATE
// ======================================================

const verificationEmailTemplate = (name: string, verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f7f6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
    }

    .header {
      background: #0056b3;
      color: #ffffff;
      padding: 25px;
      text-align: center;
    }

    .content {
      padding: 30px;
      line-height: 1.6;
    }

    .btn {
      display: inline-block;
      padding: 12px 20px;
      background: #0056b3;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
    }

    .footer {
      font-size: 12px;
      text-align: center;
      padding: 15px;
      color: #777777;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h2>Skillbridge</h2>
    </div>

    <div class="content">
      <h3>Hello ${name || "User"},</h3>

      <p>
        Thanks for joining Skillbridge.
        Please verify your email to activate your account.
      </p>

      <a href="${verificationUrl}" class="btn">
        Verify Account
      </a>

      <p style="margin-top:20px; font-size:12px;">
        If the button doesn't work, copy this link:
        <br />
        ${verificationUrl}
      </p>

      <p style="margin-top:20px;">
        If you didn’t request this, ignore this email.
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Skillbridge
    </div>

  </div>
</body>
</html>
`;

// ======================================================
// AUTH CONFIG
// ======================================================

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [appConfig.app_url || "http://localhost:3000"],

    // ==================================================
    // USER CONFIG
    // ==================================================

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
            },

            isBanned: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
        },
    },

    // ==================================================
    // SESSION CALLBACKS
    // ==================================================

    callbacks: {
        async session({ session, user }: { session: any; user: any }) {
            return {
                ...session,

                user: {
                    ...session.user,
                    role: user.role,
                    isBanned: user.isBanned ?? false,
                },
            };
        },
    },

    // ==================================================
    // EMAIL & PASSWORD AUTH
    // ==================================================

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },

    // ==================================================
    // SOCIAL PROVIDERS
    // ==================================================

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: appConfig.gc_id as string,
            clientSecret: appConfig.gc_pass as string,
        },
    },

    // ==================================================
    // ADVANCED COOKIE CONFIG
    // ==================================================

    advanced: {
        cookies: {
            session_token: {
                name: "sb_session_token",

                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    partitioned: true,
                },
            },

            state: {
                name: "sb_state",

                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    partitioned: true,
                },
            },
        },
    },

    // ==================================================
    // EMAIL VERIFICATION
    // ==================================================

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,

        sendVerificationEmail: async ({
            user,
            url,
        }: {
            user: any;
            url: string;
        }) => {
            try {
                await transporter.sendMail({
                    from: `"Skillbridge Team" <${appConfig.nm_user}>`,
                    to: user.email,
                    subject: "Verify your Skillbridge account",

                    html: verificationEmailTemplate(user.name, url),
                });
            } catch (error) {
                console.error("Email verification error:", error);
                throw error;
            }
        },
    },

    // ==================================================
    // PLUGINS
    // ==================================================

    plugins: [oAuthProxy()],
});
