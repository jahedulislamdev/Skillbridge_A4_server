import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";
import { UserRole } from "../../types/enum/userRole";

//* create booking
const createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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

//* get Bookings
const getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await bookingService.getBookings(
            req.user?.id as string,
            req.user?.role as UserRole,
        );
        res.status(200).json({
            success: true,
            message: "booking retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

//* get individual booking by id
const getBookingById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await bookingService.getBookingById(
            req.params.bookingId as string,
            req.user?.id as string,
            req.user?.role as UserRole,
        );
        res.status(200).json({
            success: true,
            message: "booking retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

//* get booking by tutor id
const getBookingByTutorId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await bookingService.getBookingByTutorId(
            req.params.tutorId as string,
        );
        res.status(200).json({
            success: true,
            message: "booking retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

//* update Bookings
const updateBookings = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { status, meetingLink } = req.body;
        const result = await bookingService.updateBooking(
            req.params.bookingId as string,
            req.user?.id as string,
            req.user?.role as UserRole,
            status,
            meetingLink,
        );
        res.status(200).json({
            success: true,
            message: "booking updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

//* delete booking
const deleteBookings = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await bookingService.deleteBooking(
            req.params.bookingId as string,
            req.user?.role as UserRole,
        );
        res.status(200).json({
            success: true,
            message: "booking deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const bookingController = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookings,
    deleteBookings,
    getBookingByTutorId,
};
