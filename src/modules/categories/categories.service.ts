import { prisma } from "../../lib/prisma";

//* create subject category
const createSubjectCategory = async (categoryName: string) => {
    if (!categoryName && categoryName.trim() === "") {
        throw new Error("Category name is required");
    }
    const existing = await prisma.category.findFirst({
        where: {
            name: categoryName,
        },
    });
    if (existing) {
        throw new Error("Category already exists");
    }
    return await prisma.category.create({ data: { name: categoryName } });
};

//* get subject category
const getSubjectCategories = async () => {
    return await prisma.category.findMany();
};

//* get subject category by id
const getSubjectCategoryById = async (categoryId: string) => {
    const result = await prisma.category.findUnique({
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
const updateSubjectCategory = async (
    categoryId: string,
    updatedName: string,
) => {
    const existing = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!existing) {
        throw new Error("Category not found");
    }
    return await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            name: updatedName,
        },
    });
};

//* delee subject category
const deleteSubjectCategory = async (categoryId: string) => {
    const existing = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!existing) {
        throw new Error("Category not found");
    }
    return await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });
};

export const subjectCategoryService = {
    createSubjectCategory,
    getSubjectCategories,
    updateSubjectCategory,
    deleteSubjectCategory,
    getSubjectCategoryById,
};
