import { Router } from "express";
import { checkRole } from "../../middleware/requireAuth";
import { subjectController } from "./subjects.controller";
import { UserRole } from "../../types/enum/userRole";

const router = Router();

router.post("/", checkRole(UserRole.admin), subjectController.createSubject);
router.get("/", subjectController.getSubjects);
router.get(
    "/:categoryId",
    checkRole(UserRole.admin),
    subjectController.getSubjectById,
);
router.patch(
    "/:categoryId",
    checkRole(UserRole.admin),
    subjectController.updateSubject,
);
router.delete(
    "/:categoryId",
    checkRole(UserRole.admin),
    subjectController.deleteSubject,
);
export const subjectsRouter = router;
