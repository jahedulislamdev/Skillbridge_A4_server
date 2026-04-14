import { Router } from "express";
import { checkRole } from "../../middleware/requireAuth";
import { subjectCategoryController } from "./categories.controller";
import { UserRole } from "../../types/enum/userRole";

const router = Router();

router.post(
    "/",
    checkRole(UserRole.admin),
    subjectCategoryController.createSubjectCategory,
);
router.get("/", subjectCategoryController.getSubjectCategories);
router.get(
    "/:categoryId",
    checkRole(UserRole.admin),
    subjectCategoryController.getSubjectCategoryById,
);
router.patch(
    "/:categoryId",
    checkRole(UserRole.admin),
    subjectCategoryController.updateSubjectCategory,
);
router.delete(
    "/:categoryId",
    checkRole(UserRole.admin),
    subjectCategoryController.deleteSubjectCategory,
);
export const categoryRouter = router;
