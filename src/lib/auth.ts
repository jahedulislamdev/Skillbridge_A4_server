import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import appConfig from "../config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: appConfig.nm_user,
        pass: appConfig.nm_pass,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [appConfig.app_url!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
            },
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: appConfig.gc_id as string,
            clientSecret: appConfig.gc_pass as string,
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const varificationUrl = `${appConfig.app_url}/verify-email?token=${token}`;
                console.log(varificationUrl);

                const info = await transporter.sendMail({
                    from: '"Skillbridge Team" <skillbridge-supoort@.com>', // sender address
                    to: user.email, // list of recipients
                    subject: "Account verification email", // subject line
                    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skillbridge Update</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f7f6;
            color: #333333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .header {
            background-color: #0056b3; /* Primary Brand Color */
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
        }
        .content h2 {
            font-size: 20px;
            color: #1a1a1a;
            margin-top: 0;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
            cursor:"pointer"
        }
        .button {
            background-color: #0056b3;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            background-color: #fbfbfb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            border-top: 1px solid #eeeeee;
        }
        .footer a {
            color: #0056b3;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Skillbridge</h1>
        </div>

        <div class="content">
            <h2>Welcome to Skillbridge, ${user.name}</h2>
            <p>Thank you for joining our platform. We are thrilled to have you on board. Our mission is to connect you with the best resources to elevate your professional journey.</p>
            <p>To get started, please verify your email address by clicking the button below. This ensures the security of your account and grants you full access to our features.</p>
            
            <div class="button-container">
                <a href="{${varificationUrl}}" class="button">Verify My Account</a>
            </div>
            <p>${url}</p>
            
            <p>If you did not request this email, please safely ignore it.</p>
            <p>Best regards,<br><strong>The Skillbridge Team</strong></p>
        </div>

        <div class="footer">
            <p>&copy; 2026 Skillbridge Inc. All rights reserved.</p>
            <p>123 Innovation Drive, Tech City, TX 75001</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>`,
                });
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
});
