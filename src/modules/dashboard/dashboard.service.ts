import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

//* stats for mvp
const getDashboardStats = async () => {
    const [users, tutors, categories, bookings, slots, reviews] =
        await Promise.all([
            prisma.user.count(),
            prisma.tutor.count(),
            prisma.category.count(),
            prisma.booking.count(),
            prisma.availabilitySlot.count(),
            prisma.review.count(),
        ]);
    const [bannedUser, activeUser] = await Promise.all([
        prisma.user.count({ where: {} }),
        prisma.user.count({ where: {} }),
    ]);
    const [completed, confirmed, pending, cancelled] = await Promise.all([
        prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
        prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
        prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
        prisma.booking.count({ where: { status: BookingStatus.CANCELLED } }),
    ]);
    const [availableSlots, bookedSlots] = await Promise.all([
        prisma.availabilitySlot.count({ where: { isBooked: false } }),
        prisma.availabilitySlot.count({ where: { isBooked: true } }),
    ]);
    return {
        users: {
            total: users,
            tutors,
            students: tutors - users,
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
        categories: {
            total: categories,
        },
        reviews: {
            total: reviews,
        },
    };
};

export const dashboardService = { getDashboardStats };
