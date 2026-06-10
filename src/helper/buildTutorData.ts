import { UserRole } from "../types/enum/userRole";
import { TutorInput } from "../types/general/tutor";

export default function buildTutorData(data: TutorInput, role: UserRole) {
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

    // Only admin can update status
    if (role === "ADMIN" && data.status !== undefined) {
        allowData.status = data.status;
    }

    return allowData;
}
