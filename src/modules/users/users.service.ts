import { UserWhereInput } from "../../../generated/prisma/models";
import { UserRole } from "../../types/enum/userRole";
import { prisma } from "../../lib/prisma";

interface UserProps {
    name: string;
    image: string;
}
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

const getUsreById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tutorProfile: { select: { id: true } },
        },
    });
    if (!user) {
        throw new Error("user is not exist!");
    }
    return user;
};

const updateUser = async (
    loggedInUserId: string,
    targetUserId: string,
    role: UserRole,
    data: UserProps,
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: targetUserId,
        },
    });
    if (!user) {
        throw new Error("user is not exist in your record!");
    }
    if (role !== UserRole.admin && user.id !== loggedInUserId) {
        throw new Error("You have no access to update others profile");
    }
    const allowedData = {
        name: data.name,
        image: data.image,
    };
    return await prisma.user.update({
        where: { id: targetUserId },
        data: allowedData,
    });
};
export const userService = {
    getUsers,
    updateUser,
    getUsreById,
};
