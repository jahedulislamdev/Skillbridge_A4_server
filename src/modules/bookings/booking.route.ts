import { bookingController } from "./booking.controller";
import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";
import { Router } from "express";

const router = Router();

router.post(
    "/:slotId",
    checkRole(UserRole.user, UserRole.tutor, UserRole.admin),
    bookingController.createBooking,
);
router.get(
    "/",
    checkRole(UserRole.admin, UserRole.tutor, UserRole.user),
    bookingController.getBookings,
);

export const bookingRouter = router;
