import { Tutor } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutor = async (
    data: Omit<Tutor, "id" | "createdAt" | "updatedAt">,
) => {
    return await prisma.tutor.create({ data });
};

export const tutorService = {
    createTutor,
};
