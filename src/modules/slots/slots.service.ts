import { DayOfWeek } from "../../../generated/prisma/enums";
import { isValidTime } from "../../helper/timeFormatter";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

const createslot = async (
    userId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
) => {
    const tutor = await prisma.tutor.findUnique({
        where: { userId },
    });

    if (!tutor) {
        throw new Error("Tutor not found");
    }

    // time format check
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
        throw new Error("Invalid time format. use this format (HH:mm:ss)");
    }

    // logical check end time cann't be lt from start time
    const newStart = new Date(`1970-01-01T${startTime}Z`);
    const newEnd = new Date(`1970-01-01T${endTime}Z`);

    if (newStart >= newEnd) {
        throw new Error("Start time must be before end time");
    }

    // tutor cann't create slot in same day, same time
    const existingSlot = await prisma.availabilitySlot.findFirst({
        where: {
            tutorId: tutor.id,
            dayOfWeek,
            startTime: { lt: newEnd },
            endTime: { gt: newStart },
        },
    });

    if (existingSlot) {
        throw new Error("Slot overlaps with existing slot");
    }

    return await prisma.availabilitySlot.create({
        data: {
            tutorId: tutor.id,
            dayOfWeek,
            startTime: newStart,
            endTime: newEnd,
        },
    });
};
const getSlots = async (userId: string, role: string) => {
    const existValidTutor = await prisma.tutor.findUnique({
        where: { userId },
    });
    if (!existValidTutor) {
        throw new Error("Tutor not Found!");
    }
    if (role === UserRole.admin) {
        return await prisma.availabilitySlot.findMany();
    }
    if (role !== UserRole.tutor || existValidTutor.userId !== userId) {
        throw new Error("your are not permited to create slots! ");
    }
    return await prisma.availabilitySlot.findMany({
        where: { tutorId: existValidTutor.id },
    });
};

export const slotsService = { createslot };
