import { Router } from "express";
import { tutorController } from "./tutor.controller";
import { checkRole } from "../../middleware/requireAuth";

const router = Router();

router.post("/", checkRole(), tutorController.createTutor);
router.get("/", tutorController.getTutors);
router.patch("/:tutorId", tutorController.updateTutor);

export const tutorRoute = router;
