import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { UserRole } from "../types/enum/userRole";

export function checkRole(...roles: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });
            // console.log(session);
            if (!session) {
                return res.status(403).json({
                    success: false,
                    message: "You are unauthorized!",
                });
            } else if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "your email is not varified!",
                });
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role as UserRole,
                emailVarified: session.user.emailVerified,
            };

            // check user role match or not
            console.log(req.user);

            if (roles.length && !roles.includes(req.user?.role)) {
                return res.status(401).json({
                    success: false,
                    message: "Forbidden Access!",
                });
            }
            next();
        } catch (error) {
            console.log(error);
        }
    };
}
