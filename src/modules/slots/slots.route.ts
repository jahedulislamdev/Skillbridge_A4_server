import { Router } from "express";
import { SlotController } from "./slots.controller";
import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";

const router = Router();

router.post(
    "/",
    checkRole(UserRole.admin, UserRole.tutor),
    SlotController.createSlot,
);

export const slotRouter = router;
