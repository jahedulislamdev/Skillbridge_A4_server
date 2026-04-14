import { subjectCategoryService } from "./categories.service";
import { NextFunction, Request, Response } from "express";

const createSubjectCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name } = req.body;
        const result = await subjectCategoryService.createSubjectCategory(name);

        res.status(201).json({
            success: true,
            message: "category created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getSubjectCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await subjectCategoryService.getSubjectCategories();

        res.status(200).json({
            success: true,
            message: "category retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getSubjectCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await subjectCategoryService.getSubjectCategoryById(
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
const updateSubjectCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name } = req.body;
        const result = await subjectCategoryService.updateSubjectCategory(
            req.params.categoryId as string,
            name,
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
const deleteSubjectCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await subjectCategoryService.deleteSubjectCategory(
            req.params.categoryId as string,
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

export const subjectCategoryController = {
    createSubjectCategory,
    getSubjectCategories,
    updateSubjectCategory,
    deleteSubjectCategory,
    getSubjectCategoryById,
};
