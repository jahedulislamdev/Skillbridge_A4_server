import { TutorInput } from "../types/general/tutor";

export default function buildTutorData(data: TutorInput) {
    const allowData: any = {};

    if (data.bio !== undefined) {
        allowData.bio = data.bio;
    }

    if (data.hourlyRate !== undefined) {
        allowData.hourlyRate = data.hourlyRate;
    }

    if (data.experienceYears !== undefined) {
        allowData.experienceYears = data.experienceYears;
    }

    return allowData;
}
