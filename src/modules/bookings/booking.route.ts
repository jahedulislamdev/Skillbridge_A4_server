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
router.get(
    "/:bookingId",
    checkRole(UserRole.admin, UserRole.tutor),
    bookingController.getBookingById,
);
router.get(
    "/tutor/:tutorId",
    checkRole(UserRole.tutor),
    bookingController.getBookingByTutorId,
);
router.patch(
    "/:bookingId",
    checkRole(UserRole.admin, UserRole.tutor, UserRole.user),
    bookingController.updateBookings,
);
router.delete(
    "/:bookingId",
    checkRole(UserRole.admin, UserRole.tutor, UserRole.user),
    bookingController.deleteBookings,
);

export const bookingRouter = router;
