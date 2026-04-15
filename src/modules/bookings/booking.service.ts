import { calculateBookingPrice } from "../../helper/getBookingPrice";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

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
//* delete booking

export const bookingService = {
    createBooking,
    getBookings,
};
