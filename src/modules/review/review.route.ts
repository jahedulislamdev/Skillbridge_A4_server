import { Router } from "express";
import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";
import { reviewController } from "./review.controller";

const router = Router();
router.post(
    "/:bookingId",
    checkRole(UserRole.admin, UserRole.tutor, UserRole.user),
    reviewController.createReview,
);
router.get("/", reviewController.getReviews);
router.get("/:bookingId", reviewController.getReviewsByBooking);
router.get("/:reviewId", reviewController.getReviewById);
router.get("/tutor/:tutorId", reviewController.getReviewByTutorId);
router.patch(
    "/:reviewId",
    checkRole(UserRole.admin, UserRole.user, UserRole.tutor),
    reviewController.updateReview,
);
router.delete(
    "/:reviewId",
    checkRole(UserRole.admin, UserRole.user, UserRole.tutor),
    reviewController.deleteReview,
);
export const reviewRouter = router;
