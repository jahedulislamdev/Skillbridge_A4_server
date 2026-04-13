import { TutorWhereInput } from "../../../generated/prisma/models";
import { Tutor } from "../../../generated/prisma/client";
import { UserRole } from "../../types/enum/userRole";
import { prisma } from "../../lib/prisma";

const createTutor = async (
    data: Omit<Tutor, "id" | "createdAt" | "updatedAt">,
    userId: string,
) => {
    // console.log({ data, id: userId });
    const result = await prisma.$transaction(async (tx) => {
        const tutor = await tx.tutor.create({ data: { ...data, userId } });
        await tx.user.update({
            where: { id: tutor.userId },
            data: { role: UserRole.tutor },
        });
        return tutor;
    });
    return result;
};
const getTutors = async (
    searchValue: string | undefined,
    rating: number | undefined,
    page: number,
    limit: number,
    skip: number,
) => {
    console.log("query params from service : ", {
        searchValue,
        rating,
        page,
        limit,
        skip,
    });

    const addConditon: TutorWhereInput[] = [];
    if (searchValue) {
        addConditon.push({
            OR: [
                {
                    user: {
                        name: {
                            contains: searchValue,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }
    if (rating) {
        addConditon.push({
            averageRating: {
                gte: Number(rating),
            },
        });
    }

    const result = await prisma.tutor.findMany({
        take: limit,
        skip,
        where: {
            AND: addConditon,
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
            reviews: true,
            availabilitySlots: true,
            booking: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    const totalTutor = await prisma.tutor.count({
        where: {
            AND: addConditon,
        },
    });
    // console.log(result);

    return {
        tutors: result,
        meta: {
            totalTutor,
            page,
            limit,
            totalPage: Math.ceil(totalTutor / limit),
        },
    };
};
const updateTutor = async (
    tutorId: string,
    currentUserId: string,
    role: UserRole,
    updatedData: Partial<Tutor>,
) => {
    const existValidTutor = await prisma.tutor.findUniqueOrThrow({
        where: { id: tutorId },
    });

    // only admin and tutor himself update his tutor profile
    if (role !== UserRole.admin && existValidTutor.userId !== currentUserId) {
        throw new Error("You are not allowed to update this profile");
    }

    const updatedTutor = await prisma.tutor.update({
        where: { id: tutorId },
        data: updatedData,
    });
    return updatedTutor;
};
const deleteTutor = async (tutorId: string, role: UserRole) => {
    // only admin and tutor himself delete his tutor profile
    const existValidTutor = await prisma.tutor.findUnique({
        where: { id: tutorId },
    });
    if (!existValidTutor) {
        throw new Error("Tutor not found");
    }
    if (role !== UserRole.admin && existValidTutor.userId !== tutorId) {
        throw new Error("You are not allowed to delete this profile");
    }
    return await prisma.tutor.delete({
        where: {
            id: tutorId,
        },
    });
};
export const tutorService = {
    createTutor,
    getTutors,
    updateTutor,
    deleteTutor,
};
