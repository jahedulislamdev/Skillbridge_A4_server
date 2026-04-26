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
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);

        const result = await userService.updateUser(
            req.user?.id as string,
            req.params.id as string,
            req.user?.role as UserRole,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "user updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const userControler = {
    getUsers,
    updateUser,
};
