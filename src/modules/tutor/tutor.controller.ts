import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";

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
        console.log(req.params);

        const searchParams =
            typeof search === "string" && search.trim() !== ""
                ? search.trim()
                : undefined;
        console.log("search value from controller", searchParams);

        const tutorRating = typeof rating === "number" ? rating : undefined;
        const result = await tutorService.getTutors(searchParams, tutorRating);
        // console.log(result);

        res.status(201).json({
            success: true,
            message: "tutor retrived successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const tutorController = {
    createTutor,
    getTutors,
};
