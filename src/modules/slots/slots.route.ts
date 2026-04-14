import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";
import { SlotController } from "./slots.controller";
import { Router } from "express";

const router = Router();

router.post(
    "/",
    checkRole(UserRole.admin, UserRole.tutor),
    SlotController.createSlot,
);
router.get(
    "/",
    checkRole(UserRole.admin, UserRole.tutor),
    SlotController.getSlots,
);
router.patch(
    "/:slotId",
    checkRole(UserRole.admin, UserRole.tutor),
    SlotController.updateSlot,
);

export const slotRouter = router;
