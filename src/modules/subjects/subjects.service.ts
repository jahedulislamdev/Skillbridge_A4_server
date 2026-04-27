import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/userRole";

//* create subject subject
const createSubject = async (subjectName: string, role: UserRole) => {
    if (role !== UserRole.admin) {
        throw new Error("unauthorized");
    }
    if (!subjectName && subjectName.trim() === "") {
        throw new Error("subject name is required");
    }

    const existing = await prisma.subjects.findFirst({
        where: {
            name: subjectName,
        },
    });
    if (existing) {
        throw new Error("subject already exists");
    }
    return await prisma.subjects.create({ data: { name: subjectName } });
};

//* get subject subject
const getSubjects = async () => {
    return await prisma.subjects.findMany();
};

//* get subject subject by id
const getSubjectById = async (subjectId: string) => {
    const result = await prisma.subjects.findUnique({
        where: {
            id: subjectId,
        },
    });
    if (!result) {
        throw new Error("subject not found!");
    }
    return result;
};

//* update subject subject
const updateSubject = async (
    subjectId: string,
    updatedName: string,
    role: UserRole,
) => {
    if (role !== UserRole.admin) {
        throw new Error("unauthorized");
    }
    const existing = await prisma.subjects.findUnique({
        where: {
            id: subjectId,
        },
    });
    if (!existing) {
        throw new Error("subject not found");
    }
    return await prisma.subjects.update({
        where: {
            id: subjectId,
        },
        data: {
            name: updatedName,
        },
    });
};

//* delee subject subject
const deleteSubject = async (subjectId: string, role: UserRole) => {
    if (role !== UserRole.admin) {
        throw new Error("unauthorized");
    }
    const existing = await prisma.subjects.findUnique({
        where: {
            id: subjectId,
        },
    });
    if (!existing) {
        throw new Error("subject not found");
    }
    console.log("subject it form service:", subjectId);

    const tutorsSubject = await prisma.tutorSubject.findFirst({
        where: { subjects: { id: subjectId } },
    });
    if (tutorsSubject) {
        throw new Error(
            "This subject is assigned to a tutor and cannot be deleted.",
        );
    }

    return await prisma.subjects.delete({
        where: {
            id: subjectId,
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
