import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import { UserRole } from "../../types/enum/userRole";

const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { rating, comment } = req.body;
        const result = await reviewService.createReview(
            req.params.bookingId as string,
            req.user?.id as string,
            rating,
            comment,
        );

        res.status(201).json({
            success: true,
            message: "review submitted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await reviewService.getReviews(
            req.params.bookingId as string,
        );

        res.status(200).json({
            success: true,
            message: "review retreived successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getReviewById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await reviewService.getReviewById(
            req.params.reviewId as string,
        );

        res.status(200).json({
            success: true,
            message: "review retreived successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const updateReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { rating, comment } = req.body;
        const result = await reviewService.updateReview(
            req.params.reviewId as string,
            req.user?.id as string,
            rating,
            comment,
        );

        res.status(200).json({
            success: true,
            message: "review updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await reviewService.deleteReview(
            req.params.reviewId as string,
            req.user?.id as string,
            req.user?.role as UserRole,
        );

        res.status(200).json({
            success: true,
            message: "review deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const reviewController = {
    createReview,
    getReviews,
    updateReview,
    deleteReview,
    getReviewById,
};
