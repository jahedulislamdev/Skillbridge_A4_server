import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { checkRole } from "../../middleware/requireAuth";
import { UserRole } from "../../types/enum/userRole";

const router = Router();
router.get("/stats", dashboardController.getDashboardStats);
export const dashboardRoute = router;
