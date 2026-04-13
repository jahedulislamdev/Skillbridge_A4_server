import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import appConfig from "./config";
import express from "express";
import cors from "cors";
import { tutorRoute } from "./modules/tutor/tutor.route";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors({ origin: appConfig.app_url, credentials: true }));

// routes
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/v1/tutors", tutorRoute);

// demo route
app.get("/", (req, res) => {
    res.send("Hello form skillbridge!");
});

// global error handler
app.use(errorHandler);

export default app;

// git remote add origin https://github.com/jahedulislamdev/Skillbridge_A4_server.git
