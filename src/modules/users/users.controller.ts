import buildPagination from "../../helper/paginationHelper";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../types/enum/userRole";
import { userService } from "./users.service";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, skip } = buildPagination(req.query);
        const { searchValue } = req.query;
        const search =
            typeof searchValue === "string" && searchValue.trim() !== ""
                ? searchValue
                : undefined;
        const result = await userService.getUsers(
            req.user?.role as UserRole,
            page,
            limit,
            skip,
            search,
        );

        res.status(200).json({
            success: true,
            message: "users retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const userControler = {
    getUsers,
};
