import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";

const createSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const meetingLink = req.body?.meetingLink;
        const result = await bookingService.createBooking(
            req.user?.id as string,
            req.params.slotId as string,
            meetingLink,
        );

        res.status(201).json({
            success: true,
            message: "slot Booked successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const bookingController = {
    createSlot,
};
