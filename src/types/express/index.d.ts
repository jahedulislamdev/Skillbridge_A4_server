import { Request } from "express";
import { UserRole } from "../enum/userRole";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: UserRole;
                emailVarified: boolean;
                isBanned: boolean;
            };
        }
    }
}
