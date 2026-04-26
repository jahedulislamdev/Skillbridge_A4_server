import { Router } from "express";
import { userControler } from "./users.controller";
import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";

const router = Router();
router.get("/", checkRole(UserRole.admin), userControler.getUsers);
router.patch(
    "/:id",
    checkRole(UserRole.admin, UserRole.tutor, UserRole.user),
    userControler.updateUser,
);

export const userRouter = router;
