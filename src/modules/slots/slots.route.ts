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
router.get("/", SlotController.getSlots);
router.get("/:slotId", checkRole(), SlotController.getSlots);
router.patch(
    "/:slotId",
    checkRole(UserRole.admin, UserRole.tutor),
    SlotController.updateSlot,
);
router.delete(
    "/:slotId",
    checkRole(UserRole.admin, UserRole.tutor),
    SlotController.deleteSlot,
);

export const slotRouter = router;
