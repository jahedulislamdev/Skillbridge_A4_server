import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import appConfig from "./config/index.js";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { tutorRoute } from "./modules/tutor/tutor.route";
import { errorHandler } from "./middleware/errorHandler";
import { subjectsRouter } from "./modules/subjects/subjects.route";
import { slotRouter } from "./modules/slots/slots.route";
import { bookingRouter } from "./modules/bookings/booking.route";
import { reviewRouter } from "./modules/review/review.route";
import { dashboardRoute } from "./modules/dashboard/dashboard.route";
import { userRouter } from "./modules/users/users.route";

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: appConfig.app_url, credentials: true }));

// routes
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tutors", tutorRoute);
app.use("/api/v1/subjects", subjectsRouter);
app.use("/api/v1/slots", slotRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/dashboard", dashboardRoute);

// demo route
app.get("/", (req, res) => {
    res.send("Hello form skillbridge!");
});

// global error handler
app.use(errorHandler);

// 4o4 handler
app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found!",
        method: req.method,
        path: req.originalUrl,
        date: new Date().toISOString,
    });
});

export default app;

// git remote add origin https://github.com/jahedulislamdev/Skillbridge_A4_server.git
