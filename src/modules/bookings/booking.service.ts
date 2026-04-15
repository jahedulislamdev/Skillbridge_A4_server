import { calculateBookingPrice } from "../../helper/getBookingPrice";
import { UserRole } from "../../types/enum/userRole";
import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";

//* create bookig (user(student) can booking available slots)
const createBooking = async (
    userId: string,
    slotId: string,
    meetingLink?: string,
) => {
    // check user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error("User Not Found!");
    }
    const result = await prisma.$transaction(async (tx) => {
        const freshSlot = await tx.availabilitySlot.findUnique({
            where: { id: slotId },
            include: { tutor: true },
        });

        if (!freshSlot) throw new Error("Slot Not Found!");
        if (freshSlot.isBooked) throw new Error("Slot Already Booked");

        if (freshSlot.tutor.userId === userId) {
            throw new Error("You cannot book your own slot");
        }

        const slotPrice = calculateBookingPrice(
            freshSlot.startTime,
            freshSlot.endTime,
            freshSlot.tutor.hourlyRate,
        );

        const booking = await tx.booking.create({
            data: {
                studentId: userId,
                tutorId: freshSlot.tutorId,
                slotId,
                meetingLink: meetingLink ?? null,
                price: slotPrice,
                scheduledAt: freshSlot.startTime,
            },
        });

        await tx.availabilitySlot.update({
            where: { id: slotId },
            data: { isBooked: true },
        });

        return booking;
    });
    return result;
};

//* get bookigs
const getBookings = async (userId: string, role: UserRole) => {
    if (role === UserRole.admin) {
        return await prisma.booking.findMany();
    }
    const studentBookings = await prisma.booking.findMany({
        where: {
            studentId: userId,
        },
    });
    if (studentBookings.length === 0) {
        return [];
    }
    return studentBookings;
};

//* update booking
const updateBooking = async (
    bookingId: string,
    userId: string,
    role: UserRole,
    status: BookingStatus,
    meetingLink?: string,
) => {
    const existBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!existBooking) {
        throw new Error("Booking Not Found!");
    }
    // admin can change status and meeting link.
    if (role === UserRole.admin) {
        return await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status,
                meetingLink: meetingLink ?? null,
            },
        });
    }
    // check ownership (bcz a tutor can booked oter tutor's slot as a student)
    const tutor = await prisma.tutor.findUnique({ where: { userId } });
    const isTutorOfThisBooking = tutor && tutor.id === existBooking.tutorId;
    const isStudentOfThisBooking = existBooking.studentId === userId;

    //*  tutor can change the status and meetinglink also.
    if (isTutorOfThisBooking) {
        return prisma.booking.update({
            where: { id: bookingId },
            data: { status, meetingLink: meetingLink ?? null },
        });
    }

    //* student can change status "CANCELLED" only.
    if (isStudentOfThisBooking) {
        // prevent changes except cancel status
        if (status !== BookingStatus.CANCELLED) {
            throw new Error("Student can only cancel booking");
        }
        return prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CANCELLED },
        });
    }

    throw new Error("Unauthorized");
};
//* delete booking
const deleteBooking = async (bookingId: string, role: UserRole) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new Error("Booking Not Found!");
    }

    // only admin can delete booking
    if (role !== UserRole.admin) {
        throw new Error("Only admin can delete booking");
    }

    //  prevent deleting compleated booking
    if (booking.status === BookingStatus.COMPLETED) {
        throw new Error("Completed booking cannot be deleted");
    }

    return await prisma.booking.delete({
        where: { id: bookingId },
    });
};

export const bookingService = {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking,
};
