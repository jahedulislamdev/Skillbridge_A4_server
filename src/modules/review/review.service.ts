import { BookingStatus } from "../../../generated/prisma/enums";
import { updateTutorRating } from "../../helper/updateTutorRating";
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
    return await prisma.$transaction(async (tx) => {
        const existingReview = await tx.review.findFirst({
            where: {
                bookingId,
                studentId: userId,
            },
        });
        if (existingReview) {
            throw new Error("You already submitted your review");
        }
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        const review = await tx.review.create({
            data: {
                rating,
                comment: comment ?? null,
                studentId: userId,
                tutorId: booking.tutorId,
                bookingId: bookingId,
            },
        });
        await updateTutorRating(tx, booking.tutorId);
        return review;
    });

    // student can review (1 student 1booking 1 review) when bookings compleated
    // studentId, bookingId need
};
//* get all review
const getReviews = async () => {
    return await prisma.review.findMany({
        include: {
            student: {
                select: {
                    name: true,
                    image: true,
                },
            },
            tutor: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });
};

const getReviewByTutorId = async (tutorId: string) => {
    return await prisma.review.findMany({ where: { tutorId } });
};

//* get review by booking
const getReviewsByBooking = async (bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!booking) {
        throw new Error("Booking not Found!");
    }
    return await prisma.review.findMany({
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });
};

//* get review by Id
const getReviewById = async (reviewId: string) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
            booking: {
                select: {
                    id: true,
                    slotId: true,
                    scheduledAt: true,
                },
            },
            student: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
    if (!review) {
        throw new Error("Review not Found!");
    }
    return review;
};

//* update review (only student can update their review)
const updateReview = async (
    reviewId: string,
    studentId: string,
    rating: number,
    comment?: string,
) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { tutorId: true, studentId: true },
    });
    if (!review) {
        throw new Error("Review not Found!");
    }
    if (review.studentId !== studentId) {
        throw new Error("You can't edit others' reviews");
    }
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }
    return await prisma.$transaction(async (tx) => {
        const result = await tx.review.update({
            where: { id: reviewId },
            data: {
                rating,
                comment: comment?.trim() ? comment : null,
            },
        });
        await updateTutorRating(tx, review.tutorId);
        return result;
    });
};

//* delete review (admin and student himself delete review)
const deleteReview = async (
    reviewId: string,
    userId: string,
    role: UserRole,
) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { tutorId: true, studentId: true },
    });
    if (!review) {
        throw new Error("Review Not Found!");
    }
    if (role !== UserRole.admin && review.studentId !== userId) {
        throw new Error("You are not allow to delete this review");
    }
    return await prisma.$transaction(async (tx) => {
        const result = await tx.review.delete({ where: { id: reviewId } });
        await updateTutorRating(tx, review.tutorId);
        return result;
    });
};

export const reviewService = {
    getReviewByTutorId,
    createReview,
    getReviewsByBooking,
    updateReview,
    deleteReview,
    getReviewById,
    getReviews,
};
