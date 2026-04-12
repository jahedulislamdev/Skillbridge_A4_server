import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import appConfig from "./config";
import cors from "cors";
import { tutorRoute } from "./modules/tutor/tutor.route";

const app = express();

app.use(express.json());
app.use(cors({ origin: appConfig.app_url, credentials: true }));

// routes
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/v1/tutors", tutorRoute);

app.get("/", (req, res) => {
    res.send("Hello form skillbridge!");
});
export default app;

// git remote add origin https://github.com/jahedulislamdev/Skillbridge_A4_server.git
