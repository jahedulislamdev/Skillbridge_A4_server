import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

//* create subject category
const createSubject = async (categoryName: string, role: UserRole) => {
    if (role !== UserRole.admin) {
        throw new Error("unauthorized");
    }
    if (!categoryName && categoryName.trim() === "") {
        throw new Error("Category name is required");
    }

    const existing = await prisma.subjects.findFirst({
        where: {
            name: categoryName,
        },
    });
    if (existing) {
        throw new Error("Category already exists");
    }
    return await prisma.subjects.create({ data: { name: categoryName } });
};

//* get subject category
const getSubjects = async () => {
    return await prisma.subjects.findMany();
};

//* get subject category by id
const getSubjectById = async (categoryId: string) => {
    const result = await prisma.subjects.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!result) {
        throw new Error("category not found!");
    }
    return result;
};

//* update subject category
const updateSubject = async (
    categoryId: string,
    updatedName: string,
    role: UserRole,
) => {
    if (role !== UserRole.admin) {
        throw new Error("unauthorized");
    }
    const existing = await prisma.subjects.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!existing) {
        throw new Error("Category not found");
    }
    return await prisma.subjects.update({
        where: {
            id: categoryId,
        },
        data: {
            name: updatedName,
        },
    });
};

//* delee subject category
const deleteSubject = async (categoryId: string, role: UserRole) => {
    if (role !== UserRole.admin) {
        throw new Error("unauthorized");
    }
    const existing = await prisma.subjects.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!existing) {
        throw new Error("Category not found");
    }
    return await prisma.subjects.delete({
        where: {
            id: categoryId,
        },
    });
};

export const subjectService = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
