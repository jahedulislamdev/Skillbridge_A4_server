import { Router } from "express";
import { userControler } from "./users.controller";
import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";

const router = Router();
router.get("/", checkRole(UserRole.admin), userControler.getUsers);

export const userRouter = router;
