import { NextFunction, Request, Response } from "express";
import { slotsService } from "./slots.service";

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

export const SlotController = {
    createSlot,
};
