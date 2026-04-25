import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

//* stats for mvp
const getDashboardStats = async () => {
    const [
        users,
        tutors,
        admins,
        subjects,
        bookings,
        slots,
        reviews,
        completed,
        confirmed,
        pending,
        cancelled,
        availableSlots,
        bookedSlots,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: UserRole.tutor } }),
        prisma.user.count({ where: { role: UserRole.admin } }),
        prisma.subjects.count(),
        prisma.booking.count(),
        prisma.availabilitySlot.count(),
        prisma.review.count(),

        //   prisma.user.count({ where: { isBanned: true } }),
        //   prisma.user.count({ where: { isBanned: false } }),

        prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
        prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
        prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
        prisma.booking.count({ where: { status: BookingStatus.CANCELLED } }),

        prisma.availabilitySlot.count({ where: { isBooked: false } }),
        prisma.availabilitySlot.count({ where: { isBooked: true } }),
    ]);

    return {
        users: {
            total: users,
            tutors,
            admins,
            students: users - tutors,
        },
        bookings: {
            total: bookings,
            completed,
            confirmed,
            pending,
            cancelled,
        },
        slots: {
            total: slots,
            available: availableSlots,
            booked: bookedSlots,
        },
        subjects: {
            total: subjects,
        },
        reviews: {
            total: reviews,
        },
    };
};

export const dashboardService = { getDashboardStats };
