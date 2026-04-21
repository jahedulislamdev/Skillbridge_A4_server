import { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

const getUsers = async (
    role: UserRole,
    page: number,
    limit: number,
    skip: number,
    searchValue: string | undefined,
) => {
    if (role !== UserRole.admin) {
        throw new Error("Unauthorized");
    }
    const andCondition: UserWhereInput[] = [];
    if (searchValue) {
        andCondition.push({
            OR: [
                {
                    name: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            take: limit,
            skip,
            where: {
                AND: andCondition,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.user.count(),
    ]);
    return {
        users,
        meta: {
            limit,
            page,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};

export const userService = {
    getUsers,
};
