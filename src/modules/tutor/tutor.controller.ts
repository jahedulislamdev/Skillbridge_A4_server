import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";
import buildPagination from "../../helper/paginationHelper";
import { UserRole } from "../../types/enum/userRole";

const createTutor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await tutorService.createTutor(
            req.body,
            req.user?.id as string,
        );

        res.status(201).json({
            success: true,
            message: "tutor created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getTutors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, rating } = req.query;

        const searchParams =
            typeof search === "string" && search.trim() !== ""
                ? search.trim()
                : undefined;

        const tutorRating = parseInt(rating as string);
        const { page, limit, skip } = buildPagination(req.query);

        // console.log({ page, limit, skip, searchParams, rating });

        const result = await tutorService.getTutors(
            searchParams,
            tutorRating,
            page,
            limit,
            skip,
        );

        res.status(200).json({
            success: true,
            message: "tutor retrived successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const updateTutor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await tutorService.updateTutor(
            req.params.tutorId as string,
            req.user?.role as UserRole,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "tutor profile updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const tutorController = {
    createTutor,
    getTutors,
    updateTutor,
};
