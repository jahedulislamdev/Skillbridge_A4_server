// import { Prisma } from "../../generated/prisma/client";

import { Prisma } from "../generated/prisma/client";

export const updateTutorRating = async (
    tx: Prisma.TransactionClient,
    tutorId: string,
) => {
    const agg = await tx.review.aggregate({
        where: { id: tutorId },
        _avg: { rating: true },
        _count: { rating: true },
    });
    await tx.tutor.update({
        where: { id: tutorId },
        data: { averageRating: Number(agg._avg.rating) || 0 },
    });
};
