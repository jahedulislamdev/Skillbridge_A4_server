import { UserRole } from "../../types/enum/userRole";
import { subjectService } from "./subjects.service";
import { NextFunction, Request, Response } from "express";

const createSubject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name } = req.body;
        const result = await subjectService.createSubject(
            name,
            req.user?.role as UserRole,
        );

        res.status(201).json({
            success: true,
            message: "category created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await subjectService.getSubjects();

        res.status(200).json({
            success: true,
            message: "category retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getSubjectById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await subjectService.getSubjectById(
            req.params.categoryId as string,
        );

        res.status(200).json({
            success: true,
            message: "category retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const updateSubject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name } = req.body;
        const result = await subjectService.updateSubject(
            req.params.categoryId as string,
            name,
            req.user?.role as UserRole,
        );

        res.status(200).json({
            success: true,
            message: "category updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const deleteSubject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        console.log("subject id form controller: ", req.params.subjectId);

        const result = await subjectService.deleteSubject(
            req.params.subjectId as string,
            req.user?.role as UserRole,
        );
        res.status(200).json({
            success: true,
            message: "category deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const subjectController = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
