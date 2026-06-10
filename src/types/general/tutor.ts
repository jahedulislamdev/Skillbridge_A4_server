import { TutomStatus } from "../../generated/prisma/enums";

export type TutorInput = {
    bio: string;
    hourlyRate: number;
    experienceYears?: number;
    subjectIds: string[];
    status?: TutomStatus;
};
