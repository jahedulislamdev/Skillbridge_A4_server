import { TutorWhereInput } from "../../../generated/prisma/models";
import { Tutor } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutor = async (
    data: Omit<Tutor, "id" | "createdAt" | "updatedAt">,
    userId: string,
) => {
    // console.log({ data, id: userId });
    return await prisma.tutor.create({ data: { ...data, userId } });
};
const getTutors = async (
    searchValue: string | undefined,
    rating: number | undefined,
) => {
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

    const result = await prisma.tutor.findMany({
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
    });

    return result;
};

export const tutorService = {
    createTutor,
    getTutors,
};
