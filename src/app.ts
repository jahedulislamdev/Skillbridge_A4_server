import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";

const app = express();
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.get("/", (req, res) => {
    res.send("Hello form skillbridge!");
});
export default app;

// git remote add origin https://github.com/jahedulislamdev/Skillbridge_A4_server.git
