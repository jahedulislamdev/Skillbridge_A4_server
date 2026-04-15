import { Prisma } from "../../generated/prisma/client";

export const calculateBookingPrice = (
    startTime: Date,
    endTime: Date,
    hourlyRate: Prisma.Decimal,
) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs <= 0) {
        throw new Error("Invalid slot time");
    }
    const durationInMinutes = durationMs / (1000 * 60);
    const durationInHours = durationInMinutes / 60;
    const durationDecimal = new Prisma.Decimal(durationInHours);
    const price = hourlyRate.mul(durationDecimal);
    return price.toDecimalPlaces(2);
};
