import { NextFunction, Request, Response } from "express";
import { UserRole } from "../types/enum/userRole";
import { auth } from "../lib/auth";

const authChecker = (...roles: UserRole) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession();
            console.log(session);
        } catch (error) {}
    };
};
