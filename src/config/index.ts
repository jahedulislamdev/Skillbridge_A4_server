import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const appConfig = {
    port: process.env.PORT,
    app_url: process.env.APP_URL,
    db_url: process.env.DATABASE_URL,
    ba_url: process.env.BETTER_AUTH_URL,
    ba_secret: process.env.BETTER_AUTH_SECRET,
    nm_user: process.env.NODEMAILER_USER,
    nm_pass: process.env.NODEMAILER_PASS,
    gc_id: process.env.GOOGLE_CLIENT_ID,
    gc_pass: process.env.GOOGLE_CLIENT_SECRET,
};
export default appConfig;
