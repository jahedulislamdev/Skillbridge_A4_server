import { bookingController } from "./booking.controller";
import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";
import { Router } from "express";

const router = Router();

router.post(
    "/:slotId",
    checkRole(UserRole.user, UserRole.tutor, UserRole.admin),
    bookingController.createSlot,
);

export const bookingRouter = router;
