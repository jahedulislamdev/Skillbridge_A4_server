import { calculateBookingPrice } from "../../helper/getBookingPrice";
import { prisma } from "../../lib/prisma";

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
//* update booking
//* delete booking

export const bookingService = {
    createBooking,
};
