export const timevalidator = (startTime: string, endTime: string) => {
    if (isValidTime(startTime) > isValidTime(endTime)) {
        throw new Error("Invalid time format. use this format (HH:mm:ss)");
    }
    const newStart = new Date(`1970-01-01T${startTime}Z`);
    const newEnd = new Date(`1970-01-01T${endTime}Z`);

    if (newStart >= newEnd) {
        throw new Error("Start time must be before end time");
    }
    return { newStart, newEnd };
};

const isValidTime = (time: string) => {
    return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(time);
};
