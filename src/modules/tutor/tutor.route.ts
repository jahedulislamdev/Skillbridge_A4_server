import { NextFunction, Request, Response, Router } from "express";
import { tutorController } from "./tutor.controller";
import { auth as betterAuth } from "./../../lib/auth";
import { checkRole } from "../../middleware/requireAuth";

const router = Router();

router.post("/", checkRole(), tutorController.createTutor);
router.get("/", tutorController.getTutors);

export const tutorRoute = router;
