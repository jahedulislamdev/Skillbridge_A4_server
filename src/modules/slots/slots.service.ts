import { DayOfWeek } from "../../../generated/prisma/enums";
import { timevalidator } from "../../helper/timeFormatter";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

//* create new slot
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
    const { newStart, newEnd } = timevalidator(startTime, endTime);

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

//* admin can get all slots and tutor can get his own slot
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

//* update slots
const updateSlot = async (
    slotId: string,
    userId: string,
    role: UserRole,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
) => {
    const exist = await prisma.availabilitySlot.findUnique({
        where: { id: slotId },
    });
    if (!exist) {
        throw new Error("Slot Not Found");
    }
    const tutor = await prisma.tutor.findUnique({ where: { userId } });
    if (!tutor) {
        throw new Error("Unauthorized");
    }
    if (role !== UserRole.admin && exist.tutorId !== tutor.id) {
        throw new Error("You have no access to update others slot");
    }
    const { newStart, newEnd } = timevalidator(startTime, endTime);

    return await prisma.availabilitySlot.update({
        where: { id: slotId },
        data: { dayOfWeek, startTime: newStart, endTime: newEnd },
    });
};

//* deleteuser
const deleteSlot = async (slotId: string, userId: string, role: UserRole) => {
    const exist = await prisma.availabilitySlot.findUnique({
        where: { id: slotId },
    });
    if (!exist) {
        throw new Error("Slot Not Found");
    }
    const tutor = await prisma.tutor.findUnique({ where: { userId } });
    if (!tutor) {
        throw new Error("Unauthorized");
    }
    if (role !== UserRole.admin && exist.tutorId !== tutor.id) {
        throw new Error("You have no access to delete others slot");
    }

    return await prisma.availabilitySlot.delete({ where: { id: slotId } });
};
export const slotsService = { createslot, getSlots, updateSlot, deleteSlot };
