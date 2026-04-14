import { NextFunction, Request, Response } from "express";
import { slotsService } from "./slots.service";
import { UserRole } from "../../types/enum/userRole";

const createSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dayOfWeek, startTime, endTime } = req.body;
        const result = await slotsService.createslot(
            req.user?.id as string,
            dayOfWeek,
            startTime,
            endTime,
        );

        res.status(201).json({
            success: true,
            message: "new slot created successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await slotsService.getSlots(
            req.user?.id as string,
            req.user?.role as UserRole,
        );

        res.status(200).json({
            success: true,
            message: "slots retrives successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const updateSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dayOfWeek, startTime, endTime } = req.body;
        const result = await slotsService.updateSlot(
            req.params.slotId as string,
            req.user?.id as string,
            req.user?.role as UserRole,
            dayOfWeek,
            startTime,
            endTime,
        );

        res.status(200).json({
            success: true,
            message: "slot updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const deleteSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await slotsService.deleteSlot(
            req.params.slotId as string,
            req.user?.id as string,
            req.user?.role as UserRole,
        );

        res.status(200).json({
            success: true,
            message: "slot updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
export const SlotController = {
    createSlot,
    getSlots,
    updateSlot,
    deleteSlot,
};
