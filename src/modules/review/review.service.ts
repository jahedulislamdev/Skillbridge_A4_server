import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

//* create review (only student can give review in their booking slot when it's compleated)
const createReview = async (
    bookingId: string,
    userId: string,
    rating: number,
    comment?: string,
) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!booking) {
        throw new Error("Booking Not Found!");
    }
    if (booking.studentId !== userId) {
        throw new Error("You are not allowed to review this booking");
    }
    if (booking.status !== BookingStatus.COMPLETED) {
        throw new Error(
            "You cannot submit a review before completing your session",
        );
    }

    const existingReview = await prisma.review.findFirst({
        where: {
            bookingId,
            studentId: userId,
        },
    });

    if (existingReview) {
        throw new Error("You already submitted a review for this booking");
    }

    return await prisma.review.create({
        data: {
            rating,
            comment: comment ?? null,
            studentId: userId,
            tutorId: booking.tutorId,
            bookingId: bookingId,
        },
    });
    // student can review (1 student 1booking 1 review) when bookings compleated
    // studentId, bookingId need
};

//* get review
const getReviews = async (bookingId: string) => {
    return await prisma.review.findMany({
        where: { bookingId },
        include: {
            student: true,
        },
    });
};

//* get review by Id
const getReviewById = async (reviewId: string) => {
    return await prisma.review.findUnique({
        where: { id: reviewId },
    });
};

//* update review (only student can update their review)
const updateReview = async (
    reviewId: string,
    studentId: string,
    rating: number,
    comment?: string,
) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new Error("Review not Found!");
    }
    if (review.studentId !== studentId) {
        throw new Error("You can't edit others' reviews");
    }
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }
    return await prisma.review.update({
        where: { id: reviewId },
        data: {
            rating,
            comment: comment?.trim() ? comment : null,
        },
    });
};

//* delete review (admin and student himself delete review)
const deleteReview = async (
    reviewId: string,
    userId: string,
    role: UserRole,
) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        throw new Error("Review Not Found!");
    }
    if (role !== UserRole.admin && review.studentId !== userId) {
        throw new Error("You are not allow to delete this review");
    }
    return await prisma.review.delete({ where: { id: reviewId } });
};

export const reviewService = {
    createReview,
    getReviews,
    updateReview,
    deleteReview,
    getReviewById,
};
