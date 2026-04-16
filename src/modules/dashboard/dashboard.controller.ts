import { NextFunction, Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

//* get dashboard stats
const getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await dashboardService.getDashboardStats();
        res.status(200).json({
            success: true,
            message: "dashboard stats retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const dashboardController = {
    getDashboardStats,
};
