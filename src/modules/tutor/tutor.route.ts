import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";
import { tutorController } from "./tutor.controller";
import { Router } from "express";

const router = Router();

router.post(
    "/",
    checkRole(UserRole.user, UserRole.admin),
    tutorController.createTutor,
);
router.get("/", tutorController.getTutors);
router.patch(
    "/:tutorId",
    checkRole(UserRole.admin, UserRole.tutor),
    tutorController.updateTutor,
);
router.delete(
    "/:tutorId",
    checkRole(UserRole.admin, UserRole.tutor),
    tutorController.deleteTutor,
);

export const tutorRoute = router;
