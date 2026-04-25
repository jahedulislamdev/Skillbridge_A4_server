import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";
import buildPagination from "../../helper/paginationHelper";
import { UserRole } from "../../types/enum/userRole";

//* create tutor
const createTutor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bio, hourlyRate, subjectIds } = req.body;
        // console.log(req.body);

        if (!bio || !hourlyRate || !subjectIds?.length) {
            return res.status(400).json({
                success: false,
                message: "bio, hourlyRate and subjectIds are required",
            });
        }

        const result = await tutorService.createTutor(
            req.body,
            req.user?.id as string,
        );

        res.status(201).json({
            success: true,
            message: "Tutor created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

//* get tutors
const getTutors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, rating, priceMin, priceMax } = req.query;
        // console.log("from controller :", { priceMin, priceMax });
        //*  search
        const searchParams =
            typeof search === "string" && search.trim() !== ""
                ? search.trim()
                : undefined;

        //* rating
        const tutorRating =
            typeof rating === "string" && !isNaN(Number(rating))
                ? Number(rating)
                : undefined;

        //* min price
        const minPrice =
            typeof priceMin === "string" && !isNaN(Number(priceMin))
                ? Number(priceMin)
                : undefined;

        //* price max
        const maxPrice =
            typeof priceMax === "string" && !isNaN(Number(priceMax))
                ? Number(priceMax)
                : undefined;

        //* page limit and skiped data
        const { page, limit, skip } = buildPagination(req.query);
        // console.log({ page, limit, skip, searchParams, rating });

        const result = await tutorService.getTutors(
            searchParams,
            tutorRating,
            page,
            limit,
            skip,
            minPrice,
            maxPrice,
        );

        res.status(200).json({
            success: true,
            message: "tutor retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

//* get tutor by id
const getTutorById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await tutorService.getTutorById(
            req.params.tutorId as string,
        );

        res.status(200).json({
            success: true,
            message: "tutor retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
//* update tutor
const updateTutor = async (req: Request, res: Response, next: NextFunction) => {
    // console.log({
    //     tutorId: req.params.tutorId,
    //     currentUserId: req.user?.id,
    //     userRole: req.user?.role,
    //     updatedData: req.body,
    // });

    try {
        const result = await tutorService.updateTutor(
            req.params.tutorId as string,
            req.user?.id as string,
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

//* delete tutor
const deleteTutor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await tutorService.deleteTutor(
            req.params.tutorId as string,
            req.user?.id as string,
            req.user?.role as UserRole,
        );

        res.status(200).json({
            success: true,
            message: "tutor deleted successfully",
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
    deleteTutor,
    getTutorById,
};
