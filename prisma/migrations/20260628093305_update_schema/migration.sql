-- DropIndex
DROP INDEX "availableSlots_tutorId_idx";

-- DropIndex
DROP INDEX "tutorsprofile_userId_idx";

-- CreateIndex
CREATE INDEX "idx_sub_name" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "idx_tutor_hourlyRate" ON "tutorsprofile"("hourlyRate");

-- CreateIndex
CREATE INDEX "idx_tutor_bookingStatus" ON "tutorsprofile"("status");

-- CreateIndex
CREATE INDEX "idx_user_name" ON "user"("name");
