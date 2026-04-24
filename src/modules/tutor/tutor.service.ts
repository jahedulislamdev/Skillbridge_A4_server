import { TutorWhereInput } from "../../../generated/prisma/models";
import buildTutorData from "../../helper/buildTutorData";
import { TutorInput } from "../../types/general/tutor";
import { UserRole } from "../../types/enum/userRole";
import { prisma } from "../../lib/prisma";

//* create tutor profile
const createTutor = async (data: TutorInput, userId: string) => {
    // console.log({ data, id: userId });
    const exist = await prisma.tutor.findUnique({ where: { userId } });
    if (exist) {
        throw new Error("Cannot create duplicate tutor using same user ID");
    }
    const allowData = buildTutorData(data);
    return await prisma.tutor.create({
        data: { ...allowData, userId },
    });
};

//* get tutor list with pagination and search

const getTutors = async (
    search: string | undefined,
    rating: number | undefined,
    page: number,
    limit: number,
    skip: number,
    priceMin: number | undefined,
    priceMax: number | undefined,
) => {
    // console.log("query params from service : ", {
    //     searchValue,
    //     rating,
    //     page,
    //     limit,
    //     skip,
    // });

    const addConditon: TutorWhereInput[] = [];
    if (search) {
        addConditon.push({
            OR: [
                {
                    user: {
                        name: {
                            contains: search,
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
    // console.log("from service :", { priceMin, priceMax });

    if (priceMin !== undefined || priceMax !== undefined) {
        addConditon.push({
            hourlyRate: {
                ...(priceMin !== undefined && { gte: priceMin }),
                ...(priceMax !== undefined && { lte: priceMax }),
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
                    id: true,
                    name: true,
                    image: true,
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
    const total = await prisma.tutor.count({
        where: {
            AND: addConditon,
        },
    });
    // console.log(result);

    return {
        tutors: result,
        meta: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        },
    };
};

//* get tutor by id
const getTutorById = async (tutotId: string) => {
    const result = await prisma.tutor.findUnique({
        where: {
            id: tutotId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            availabilitySlots: true,
            reviews: {
                select: {
                    id: true,
                    comment: true,
                    rating: true,
                    student: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    booking: {
                        select: {
                            slotId: true,
                            scheduledAt: true,
                        },
                    },
                },
            },
        },
    });
    if (!result) {
        throw new Error("Tutor not found!");
    }
    return result;
};

//* update tutor profile
const updateTutor = async (
    tutorId: string,
    currentUserId: string,
    role: UserRole,
    updatedData: TutorInput,
) => {
    const existValidTutor = await prisma.tutor.findUnique({
        where: { id: tutorId },
    });
    if (!existValidTutor) {
        throw new Error("Tutor not Found!");
    }
    // only admin and tutor himself update his tutor profile
    if (role !== UserRole.admin && existValidTutor.userId !== currentUserId) {
        throw new Error("You are not allowed to update this profile");
    }
    // send only allow data to update
    const allowData = buildTutorData(updatedData);
    const updatedTutor = await prisma.tutor.update({
        where: { id: tutorId },
        data: allowData,
    });
    return updatedTutor;
};

//* delete tutor profile
const deleteTutor = async (
    tutorId: string,
    currentUserId: string,
    role: UserRole,
) => {
    // only admin and tutor himself delete his tutor profile
    const existValidTutor = await prisma.tutor.findUnique({
        where: { id: tutorId },
    });
    if (!existValidTutor) {
        throw new Error("Tutor not found");
    }
    // console.log({ tutorId, currentUserId, role });

    if (role !== UserRole.admin && existValidTutor.userId !== currentUserId) {
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
    getTutorById,
};
